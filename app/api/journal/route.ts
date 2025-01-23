import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const contentSchema = z.object({
  content: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const content = contentSchema.parse(await req.json());

    if (!content) {
      return NextResponse.json(
        {
          message: "Content is required",
        },
        {
          status: 411,
        }
      );
    }

    const session = await getServerSession();
    console.log("postsession" , session)

    const user = await prisma.user.findFirst({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: " Unauthorized",
        },
        {
          status: 411,
        }
      );
    }

    const prompt = `Analyze the sentiment of this text and categorize emotions (Happy, Sad, Neutral) and return the result as a JSON object including the percentages for each emotion and a final overall emotion based on the highest percentage. And based on
    highest percentage emotion return personalized_recommendation which has three category: (quote : this will include a quote based on emotion , exercise : this will include a exercise like breathing or some mind exercises based on the emotions.). secondly include a 
    friends_response: this will include a message like a friend talking and cheering user up if he is sad or feeling low i.e. neutral and enjoys if he is happy.

The JSON object should have the following structure:

{
  "emotions": {
    "Happy": <percentage>, 
    "Sad": <percentage>, 
    "Neutral": <percentage> 
  },
  "overallEmotion": "EmotionName",
  "personalized_recommendation" : {
    "quote" : <string>,
    "exercise": <string>
  },
  "friends_response" : <string>
}

Example:

{
  "emotions": {
    "Happy": 60, 
    "Sad": 10, 
    "Neutral": 30 
  },
  "overallEmotion": "Happy",
  "personalized_recommendation" : {
    "quote" : "Happiness can be found in the darkest of times , if one remembers to turn on the light",
    "exercise" : "You are feeling low How about meditating for 5 min"
  },
  "friends_response": "Hey its nice to hear your day went well. Tommorow will be much more happier"
}

strictly Remember to not include the json and ''' quotes marking in the response , just keep the object as it is shown above. 

Analyze the following text: "${content.content}"`;
    const result = await model.generateContent(prompt);
    const sentimentData = result.response.text();
    console.log("sentiment data", sentimentData);

    let parsedSentiment;
    try {
      parsedSentiment = JSON.parse(sentimentData);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error parsing sentiment response",
          error
        },
        { status: 400 }
      );
    }

    const journal = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: content.content,
        createdAt: new Date(),
        sentiment: parsedSentiment,
      },
    });

    return NextResponse.json(
      {
        message: "Journal Entry Succesful.",
        journal,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error adding Journal , ${err}`,
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const date = req.nextUrl.searchParams.get("date") || "";

    // const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

    const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

    if (date) {
      const journal = await prisma.journalEntry.findFirst({
        where: {
          id: session?.user.id,
          createdAt: {
            gte: startOfDay, // Start of the day (00:00:00 UTC)
            lt: endOfDay, // End of the day (23:59:59 UTC)
          },
        },
      });

      return NextResponse.json(
        {
          message: "Journal Found with date",
          journal,
        },
        {
          status: 200,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 411,
        }
      );
    }

    const journal = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Journal Found",
        journal,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error finding journal ${err}`,
      },
      {
        status: 411,
      }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    console.log(session);

    const url = new URL(req.url);
    const contentId = url.searchParams.get("id");

    if (!contentId) {
      return NextResponse.json(
        { message: "Content ID is required" },
        { status: 400 }
      );
    }

    const content = contentSchema.parse(await req.json());

    if (!content) {
      return NextResponse.json({
        message: "Enter what you want to update",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 411,
        }
      );
    }

    const updateJournal = await prisma.journalEntry.update({
      where: {
        id: contentId,
      },
      data: {
        content: content.content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Journal updated successfully", updateJournal },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Error updating journal: ${err}` },
      { status: 500 }
    );
  }
}
