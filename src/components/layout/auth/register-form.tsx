'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm({
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "STUDENT"
        }
    })
   const  router = useRouter()

    const onSubmit = async (data: RegisterFormData) => {
        console.log(data)
        try {
            const res = await axios.post("/api/register", data)
            if (res.status === 201) {
                // Registration successful
                console.log("Registration successful", res.data)
                setTimeout(() => {
                    router.push(res.data.data)
                }, 3000);

                // Redirect to login or dashboard
            } else {
                // Handle error
                console.error("Registration failed", res.data)
            }
        } catch (error) {
            console.error("Error during registration", error)
        }

        // You would call an API endpoint to register here
    }

    return (
        <div className="flex flex-col gap-6" {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your details to register your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">
                            <div className="grid gap-2">

                                <Label htmlFor="fullName">Full Name</Label>

                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    // required
                                    {...register("fullName")}
                                />
                                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}

                            </div>
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

                                </div>
                                <Input id="password" type="password"  {...register("password")} />
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                </div>
                                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                            <div className="grid gap-2 pb-3">
                                <div className="flex items-center">
                                    <Label htmlFor="role">Role (optional)</Label>
                                </div>
                                <Select onValueChange={(val) => setValue("role", val as RegisterFormData["role"])} defaultValue="STUDENT">
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="STUDENT">Student</SelectItem>
                                        <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                            {/* <Button variant="outline" className="w-full">
                                Login with Google
                            </Button> */}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
        // <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        //   <div>
        //     <Label htmlFor="fullName">Full Name</Label>
        //     <Input type="text" {...register("fullName")} />
        //     {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        //   </div>

        //   <div>
        //     <Label htmlFor="email">Email</Label>
        //     <Input type="email" {...register("email")} />
        //     {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        //   </div>

        //   <div>
        //     <Label htmlFor="password">Password</Label>
        //     <Input type="password" {...register("password")} />
        //     {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        //   </div>

        //   <div>
        //     <Label htmlFor="confirmPassword">Confirm Password</Label>
        //     <Input type="password" {...register("confirmPassword")} />
        //     {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        //   </div>

        //   <div>
        //     <Label htmlFor="role">Role (optional)</Label>
        //     <Select onValueChange={(val) => setValue("role", val as RegisterFormData["role"])} defaultValue="STUDENT">
        //       <SelectTrigger>
        //         <SelectValue placeholder="Select role" />
        //       </SelectTrigger>
        //       <SelectContent>
        //         <SelectItem value="STUDENT">Student</SelectItem>
        //         <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
        //         <SelectItem value="ADMIN">Admin</SelectItem>
        //       </SelectContent>
        //     </Select>
        //   </div>

        //   <Button type="submit">Register</Button>
        // </form>
    )
}
