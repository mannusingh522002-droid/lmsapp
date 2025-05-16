'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm({
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormData) => {
        const res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        })

        if (res?.error) {
            toast.error("Invalid credentials")
        } else {
            // Redirect based on user role – fetch user data or JWT
            type UserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT"
            const role: UserRole = "STUDENT" // Replace with actual user role
            switch (role) {
                case "ADMIN":
                    router.push("/dashboard/admin")
                    break
                case "INSTRUCTOR":
                    router.push("/dashboard/instructor")
                    break
                default:
                    router.push("/dashboard/student")
            }
        }
    }

    return (
        <div className="flex flex-col gap-6" {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    // required
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password"  {...register("password")} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            {/* <Button variant="outline" className="w-full">
                                Login with Google
                            </Button> */}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}
