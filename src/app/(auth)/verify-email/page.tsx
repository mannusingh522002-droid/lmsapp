"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const router = useRouter();

    const [status, setStatus] = useState<"pending" | "success" | "error" | "invalid">("pending");

    // Ref to ensure verification runs only once
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;

        const verify: () => Promise<void> = async () => {
            if (!email || !token) {
                setStatus("invalid");
                return;
            }

            try {
                const res = await axios.post("/api/verify-email", { email, token });

                if (res.status === 200) {
                    setStatus("success");
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
            }
        };

        verify();
    }, [email, token, router]);

    if (status === "invalid") {
        return (
            <div className="flex h-screen w-full items-center justify-center p-6 md:p-10">
                <h1>Error</h1>
                <p>Invalid or missing verification link.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-6 md:p-10">
            {status === "pending" && <p>Verifying your email...</p>}
            {status === "success" && <p>✅ Your email has been verified successfully! Redirecting...</p>}
            {status === "error" && <p>❌ Email verification failed. Please try again later.</p>}
        </div>
    );
};

export default VerifyEmail;
