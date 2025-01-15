import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contentSchema = z.object({
  content: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const content = contentSchema.parse(await req.json());
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

    const journal = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: content.content,
        createdAt: new Date(),
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
  } catch {
    return NextResponse.json(
      {
        message: "Error adding Journal",
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
    return NextResponse.json ({
        message: 'Error finding journal'
    } , {
        status: 411
    })
  }
}
