import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const contentSchema = z.object({
  content: z.string(),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const journal = await prisma.journalEntry.findUnique({
      where: { id: id },
    });
    if (!journal) {
      return NextResponse.json(
        {
          message: "Journal not found",
        },
        {
          status: 411,
        }
      );
    }
    return NextResponse.json(
      {
        message: "Journal found...",
        journal,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({
      message: "Error fetching Journal", error
    });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    // console.log(session);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to update the journal." },
        { status: 401 }
      );
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Journal ID is required" },
        { status: 400 }
      );
    }

    const { content } = contentSchema.parse(await req.json());

    const journal = await prisma.journalEntry.findUnique({
      where: { id },
    });

    if (!journal) {
      return NextResponse.json(
        { message: "Journal not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || journal.userId !== user.id) {
      // console.log(user , journal.userId)
      return NextResponse.json(
        { message: "Unauthorized to update this journal" },
        { status: 403 }
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
    
    Analyze the following text: "${content}"`;
    const result = await model.generateContent(prompt);
    const sentimentData = result.response.text();
    // console.log("sentiment data", sentimentData);

    let parsedSentiment;
    try {
      parsedSentiment = JSON.parse(sentimentData);
    } catch (error) {
      return NextResponse.json(
        {
          message: "Error parsing sentiment response",
          error,
        },
        { status: 400 }
      );
    }

    // Update the journal
    const updatedJournal = await prisma.journalEntry.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
        sentiment: parsedSentiment,
      },
    });

    return NextResponse.json(
      { message: "Journal updated successfully", updatedJournal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating journal:", error);
    return NextResponse.json(
      { message: "Error updating journal", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const { id } = context.params;

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to update the journal." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { message: "Journal ID is required" },
        { status: 400 }
      );
    }

    await prisma.journalEntry.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        message: "Journal Deleted Succesfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json({
      message : " Error deleting journal",
      error
    }, {
      status: 411
    })
  }
}
