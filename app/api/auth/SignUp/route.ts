import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient

export async function POST(req: NextRequest) {
  try {
    const {name, email, password} = await req.json();

    const existingUser = await prisma.user.findUnique({where: {email}});

    if (existingUser) {
        return NextResponse.json({
            message : 'User already Exist, Please Sign In'
        }, {
            status: 400
        })
    }

    const HashedPassword = await bcrypt.hash(password , 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash: HashedPassword,
            provider: 'Credentials'
        }
    })

    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: "1d" }
      );

    return NextResponse.json(
        { success: true, token , user },
        {
          headers: {
            "Set-Cookie": `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          },
        },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({
        message: 'Error creating User'
    } , {
        status: 411
    })
  }
}
