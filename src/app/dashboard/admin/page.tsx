'use client';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
const StudentDashboard = () => {
    const session = useSession();
    console.log(session);
    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome to the student dashboard!</p>
            <Button onClick={() => signOut}>logout</Button>
        </div>
    );
}
export default StudentDashboard;