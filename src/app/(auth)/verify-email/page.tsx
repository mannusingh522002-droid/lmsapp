"use client"

import VerifyEmail from "./verify-email";
import { Suspense } from "react";


const VerifyEmailpage = () => {

    return (
        <>
      <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmail />
        </Suspense>
        </>

    );
};

export default VerifyEmailpage;
