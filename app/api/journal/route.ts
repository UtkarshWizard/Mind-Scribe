import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const contentSchema = z.object({
  content: z.any(),
  plainText : z.string()
});

export async function POST(req: NextRequest) {
  try {
    const { content, plainText } = contentSchema.parse(await req.json());

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
    // console.log("postsession", session);

    const user = await prisma.user.findFirst({
      where: {
        email: session?.user.email,
      },
    });

    // console.log("user", user);

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

Analyze the following text: "${plainText}"`;
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

    function startOfDayUTC(date: Date) {
        return new Date(Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate()
        ));
      }

    function dayDifference(d1: Date, d2: Date) {
      const diff = d1.getTime() - d2.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    const today = startOfDayUTC(new Date());

    let newStreak = user.currentStreak;

    if (!user.lastEntryDate) {
      newStreak = 1;
    } else {
      const last = startOfDayUTC(new Date(user.lastEntryDate));
      const diff = dayDifference(today , last);

      if (diff == 0) {
        newStreak = 1;
      } else if ( diff == 1) {
        newStreak = user.currentStreak + 1;
      } else {
        newStreak = 0;
      }
    }

    const journal = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: content.content,
        plainText: plainText,
        createdAt: new Date(),
        sentiment: parsedSentiment,
      },
    });

    if (journal) {
      await prisma.user.update({
        where: { id: user.id},
        data: {
          currentStreak: newStreak,
          lastEntryDate: today,
        }
      })
    }

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
    // console.log("getsession", session);

    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            message: `Error finding User`,
          },
          {
            status: 411,
          }
        );
      }

      const date = req.nextUrl.searchParams.get("date") || "";

      const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999));

      if (date) {
        const journal = await prisma.journalEntry.findFirst({
          where: {
            userId: user?.id,
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

      // Pagination, sorting and mood filtering
      const page = Number(req.nextUrl.searchParams.get("page") || "1");
      const limit = Number(req.nextUrl.searchParams.get("limit") || "20");
      const sort = req.nextUrl.searchParams.get("sort") || "latest"; // 'latest' or 'oldest'
      const mood = req.nextUrl.searchParams.get("mood"); // 'Happy' | 'Neutral' | 'Sad'
      // const search = req.nextUrl.searchParams.get("search") || undefined;
      const yearParam = req.nextUrl.searchParams.get("year") || undefined;

      const orderBy = {
        createdAt: sort === "oldest" ? "asc" : "desc",
      } as const;

      const whereBase: Prisma.JournalEntryWhereInput = {
        userId: user?.id,
      };

      if (mood) {
        // Filter by sentiment.overallEmotion stored in JSON
        whereBase.sentiment = { path: ["overallEmotion"], equals: mood };
      }

      // if (search) {
      //   whereBase.plainText = { contains: search, mode: "insensitive" };
      // }

      if (yearParam) {
        const y = Number(yearParam);
        if (!Number.isNaN(y)) {
          const start = new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0));
          const end = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
          whereBase.createdAt = { gte: start, lte: end };
        }
      }

      const total = await prisma.journalEntry.count({ where: whereBase });

      const streak = user.currentStreak;

      const journals = await prisma.journalEntry.findMany({
        where: whereBase,
        orderBy,
        skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
        take: Math.max(limit, 1),
      });

      return NextResponse.json(
        {
          message: "Journals fetched",
          journals,
          total,
          page,
          limit,
          streak
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
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

