import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();

  try {
    // Fetch the current date in IST
    const currentDate = new Date(new Date().getTime());
    const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));

    // Fetch the journal entry for the current date
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: session?.user.id,
        createdAt: {
          gte: startOfDay, // Greater than or equal to the start of the day
          lte: endOfDay, // Less than or equal to the end of the day
        },
      },
      select: {
        id: true,
        content: true,
        sentiment: true,
      },
    });

    // console.log("Journal Entry:", journalEntry);

    if (!journalEntry || !journalEntry.sentiment) {
      return NextResponse.json(
        { message: "No journal entry found for today." },
        { status: 200 }
      );
    }

    let sentimentObject;

    if (typeof journalEntry.sentiment === "string") {
      try {
        sentimentObject = JSON.parse(journalEntry.sentiment);
      } catch (error) {
        console.error("Error parsing sentiment string:", error);
        return NextResponse.json(
          { message: "Error parsing sentiment data." },
          { status: 400 }
        );
      }
    } else if (typeof journalEntry.sentiment === "object" && journalEntry.sentiment !== null) {
      sentimentObject = journalEntry.sentiment;
    } else {
      return NextResponse.json(
        { message: "Invalid sentiment data structure." },
        { status: 400 }
      );
    }

    // console.log("Parsed Sentiment Object:", sentimentObject);

    return NextResponse.json({
      message: "Journal found",
      id: journalEntry.id,
      content: journalEntry.content,
      sentiment_analysis: sentimentObject.emotions,
      overall_emotion: sentimentObject.overallEmotion,
      recommendations: sentimentObject.personalized_recommendation
    });
  } catch (error) {
    console.error("Error fetching today's journal entry:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
