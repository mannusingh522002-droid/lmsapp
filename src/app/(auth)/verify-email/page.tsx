"use client";

import { Suspense } from "react";
import VerifyEmail from "./verify-email";

const VerifyEmailpage = () => {

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmail />
        </Suspense>
    );
};

export default VerifyEmailpage;
