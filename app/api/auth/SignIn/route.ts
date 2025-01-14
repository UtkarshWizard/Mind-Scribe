import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      {
        message: "User Does not exist. Please Sign Up... ",
      },
      {
        status: 400,
      }
    );
  }

  if (user.passwordHash) {
    const DcryptPassword = await bcrypt.compare(password, user.passwordHash);

    if (DcryptPassword) {
      try {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1h" }
        );

        return NextResponse.json(
            { success: true, token },
            {
              headers: {
                "Set-Cookie": `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
              },
            }
        )
      } catch (error) {
      }

      return NextResponse.json(
        {
          message: "Logged in Successfully !",
          user,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "Wrong Password! Please Check Your Password.",
        },
        {
          status: 400,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: "Log in wth Google",
      },
      {
        status: 400,
      }
    );
  }
}
