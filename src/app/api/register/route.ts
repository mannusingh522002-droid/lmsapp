import { prisma } from "@/lib/prisma";
import { User } from '@prisma/client'
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// type User = {
//     id: string
//     name: string
//     email: string
//     role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
//     createdAt: Date
//     updatedAt: Date
// }
export async function POST(request: Request) {
    const body = await request.json();
    const { name, email, password, role } = body;
    // Validate input data
    if (!name || !email || !password) {
        return NextResponse.json({ error: 'User registration failed' }, { status: 400 })

    }
    const userExist = await prisma.user.findFirst({
        where: {
            email: email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (userExist) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const userCreated = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'STUDENT', // Default to STUDENT if no role is provided
        },
    });
    if (!userCreated) {
        return NextResponse.json({ error: 'User registration failed' }, { status: 500 })
    }
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
}

