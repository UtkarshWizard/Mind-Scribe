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

    const prompt = `Analyze the sentiment of this text and categorize emotions (e.g., happy, sad, neutral): "${content.content}" . Then i want you to act as my friend whom i am sharing my feelings and return me reponse like how was my sentiments overall and if its sad then motivate me and so on `;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    const journal = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: content.content,
        createdAt: new Date(),
        sentiment: result.response.text(),
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

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
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
        id: user.id,
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
  } catch {
    return NextResponse.json(
      {
        message: "Error finding journal",
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
    console.log(session)

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
        id: contentId
      },
      data: {
        content: content.content,
      },
    });

    return NextResponse.json(
      { message: "Journal updated successfully",updateJournal },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Error updating journal: ${err}` },
      { status: 500 }
    );
  }
}
