import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { CircleHelp, NotepadTextDashed, TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const studentDashboard = () => {
    const data = [
        {
            title: "Enrolled Courses",
            value: "4",
            trend: "+12.5%",
            trendIcon: <TrendingUpIcon className="size-3" />,
            description: "Trending up this month",
            footerText: "Visitors for the last 6 months"
        },
        {
            title: "Completed Courses",
            value: "25",
            trend: "+5.0%",
            trendIcon: <TrendingUpIcon className="size-3" />,
            description: "Trending up this month",
            footerText: "Courses completed this month"
        },
        {
            title: "Quizzes Attempted",
            value: "1,500",
            trend: "+10.0%",
            trendIcon: <TrendingUpIcon className="size-3" />,
            description: "Trending up this month",
            footerText: "New students this month"
        },
        {
            title: "Average Score",
            value: "50",
            trend: "+2.5%",
            trendIcon: <TrendingUpIcon className="size-3" />,
            description: "Trending up this month",
            footerText: "New instructors this month"
        }
    ]

    return (
        <>
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl">Welcome back, Manpreet singh</h2>
                <p className="text-[16px]">Welcome to the student dashboard!</p>
            </div>
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card ">
                {data.map((item, index) => (
                    <Card key={index} className="@container/card h-fit">
                        <CardHeader className="relative">
                            <CardDescription>{item.title}</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                                {item.value}
                            </CardTitle>

                        </CardHeader>

                    </Card>
                ))}

            </div>
            <div className="grid grid-cols-3 gap-4 py-4 md:gap-6 md:py-6 ">
                <div className="col-span-3  p-4 px-0 shadow-sm md:col-span-2">
                    <h2 className="text-2xl mb-6">My Course</h2>
                    <div className="w-full mt-4">

                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                                duration: 50,
                                watchDrag: true,
                            }}
                            className="w-full "
                        >
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="px-1">
                                            <Card>
                                                <Image src={"/images/course.png"} alt="course" width={100} height={100} className="w-full object-cover" />

                                                <CardContent className="flex p-1 px-2 flex-col gap-2">
                                                    <CardTitle className="">My course</CardTitle>
                                                    <CardDescription className="text-sm">
                                                        This is a sample course description. It can be a long text that describes the course content and objectives.
                                                    </CardDescription>
                                                    <Progress value={33} />
                                                    <span className="text-3xl font-semibold">{index + 1}</span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4" />
                            <CarouselNext className="-right-4" />
                        </Carousel>
                    </div>

                </div>
                <div >
                    <div className="col-span-3  p-4 px-0 shadow-sm md:col-span-2">
                        <h2 className="text-xl mb-6">Upcomming Tasks</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <Link href="/dashboard/student/assignments">
                                <Card className="w-full py-4">
                                    <CardHeader className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <NotepadTextDashed />
                                        </span>
                                        <div>


                                            <CardTitle>Assignment</CardTitle>
                                            <span className="text-sm">Due: 2023-10-01</span>
                                        </div>
                                    </CardHeader>


                                </Card>
                            </Link>

                            <Link href="/dashboard/student/assignments">
                                <Card className="w-full py-4">
                                    <CardHeader className="flex items-center gap-3">
                                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <CircleHelp strokeWidth={2.25} absoluteStrokeWidth />
                                        </span>
                                        <div>

                                            <CardTitle>Assignment</CardTitle>
                                            <span className="text-sm">Due: 2023-10-01</span>
                                        </div>

                                    </CardHeader>

                                </Card>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
export default studentDashboard;