import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Use an interface if needed for local type checks (optional)
interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

export async function POST(request: Request) {
    try {
        const body: RegisterRequest = await request.json();
        const { fullName, email, password, role } = body;

        // Validate input data
        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
                emailVerified: false,
            },
        });

        // Generate a JWT token
        const token = jwt.sign(
            { email: user.email },
            process.env.TOKEN_SECRET!, // Must be defined
            { expiresIn: "1h" }
        );

        // OPTIONAL: Save the token to DB if you want to verify it later
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken: token },
        });

        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${user.email}`;

        return NextResponse.json(
            { message: "User registered successfully", data: verifyUrl },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
