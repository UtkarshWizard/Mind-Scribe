import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { fetchedMood, notes } = await req.json();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unathorized",
        },
        {
          status: 411,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 411,
        }
      );
    }

    const existingMood = await prisma.moodTracking.findFirst({
      where: { userId: user.id },
    });

    if (existingMood) {
      const newMood = await prisma.moodTracking.update({
        where: {
          id: user.id,
        },
        data: {
          mood: fetchedMood,
          createdAt: new Date(),
          notes: notes || "",
        },
      });

      return NextResponse.json(
        {
          message: "Mood Added Succesfully.",
          newMood,
        },
        {
          status: 200,
        }
      );
    }

    const mood = await prisma.moodTracking.create({
      data: {
        userId: user.id,
        mood: fetchedMood,
        createdAt: new Date(),
        notes: notes || "",
      },
    });

    return NextResponse.json(
      {
        message: "Mood Added Succesfully.",
        mood,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error adding mood ${err}`,
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unathorized",
        },
        {
          status: 411,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 411,
        }
      );
    }

    const mood = await prisma.moodTracking.findUnique({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Mood fetched Succesfully.",
        mood,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: `Error fetching mood ${err}`,
      },
      {
        status: 411,
      }
    );
  }
}

// export async function PUT(req: NextRequest) {
//   try {
//     const session = await getServerSession();
//     const { fetchedMood, notes } = await req.json();

//     if (!session) {
//       return NextResponse.json(
//         {
//           message: "Unathorized",
//         },
//         {
//           status: 411,
//         }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//     });

//     if (!user) {
//       return NextResponse.json(
//         {
//           message: "User not found",
//         },
//         {
//           status: 411,
//         }
//       );
//     }

//     const mood = await prisma.moodTracking.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         mood: fetchedMood,
//         createdAt: new Date(),
//         notes: notes || "",
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Mood Added Succesfully.",
//         mood,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (err) {
//     return NextResponse.json(
//       {
//         message: `Error adding mood ${err}`,
//       },
//       {
//         status: 411,
//       }
//     );
//   }
// }
