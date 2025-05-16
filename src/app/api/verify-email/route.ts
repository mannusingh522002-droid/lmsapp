import { prisma } from "@/lib/prisma";
import { de } from "@faker-js/faker";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
    const { email, token } = await request.json();
    if (!email || !token) {
        return NextResponse.json(
            { error: "Email and token are required" },
            { status: 400 }
        );
    }

    // Check if the token is valid
    const isValidToken = await verifyEmailToken(email, token);

    if (!isValidToken) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 400 }
        );
    }

    // Update the user's email verification status in the database
    await updateEmailVerificationStatus(email);

    return NextResponse.json(
        { message: "Email verified successfully" },
        { status: 200 }
    );
}
async function verifyEmailToken(email: string, token: string): Promise<boolean> {
    try {
        const decoded = verify(token, process.env.TOKEN_SECRET!);
        if (!decoded) {
            return false;
        }
        const user = await prisma.user.findUnique({
            where: { email },
            select: { verificationToken: true, emailVerified: true },
        });

        if (!user || user.emailVerified || user.verificationToken !== token) {
            return false;
        }
        return (decoded as { email?: string }).email === email;
    } catch (error: unknown) {
        console.error("Token verification failed:", error);
        return false;
    }
}
async function updateEmailVerificationStatus(email: string): Promise<void> {
    await prisma.user.update({
        where: { email },
        data: { emailVerified: true, verificationToken: null },
    });
}
// Note: Ensure you have the necessary error handling and validation in place
//       for production code. This is a simplified example.