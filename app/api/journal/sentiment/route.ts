import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  try {
    // Fetch the current date in IST
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
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
        sentiment: true, // Fetch the sentiment JSON column
      },
    });

    console.log(journalEntry)

    if (!journalEntry || !journalEntry.sentiment) {
      return NextResponse.json(
        { message: "No journal entry found for today." },
        { status: 200 }
      );
    }

    const sentimentString = journalEntry?.sentiment;
    // console.log("sentimentstring" ,sentimentString)

    if (typeof sentimentString === "string") {
        const cleanedString = sentimentString
        .replace(/^"```json\\n/, "") // Remove the start of the markdown and extra escape sequences
        .replace(/\\n$/, "")         // Remove the trailing newlines
        .replace(/\\n/g, "")         // Remove all the newline escape sequences
        .replace(/\\"/g, '"')
        .replace(/```"$/, ""); 
        
        // console.log( "cleaned" , cleanedString)

      const sentimentData = JSON.parse(cleanedString);

      console.log(sentimentData)

      return NextResponse.json({
        message: "Journal found",
        id: journalEntry?.id,
        content: journalEntry?.content,
        sentiment_analysis: sentimentData.emotions,
        overall_emotion: sentimentData.overallEmotion
      });
    }
  } catch (error) {
    console.error("Error fetching today's journal entry:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 411 }
    );
  }
}
