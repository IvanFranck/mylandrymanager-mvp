import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfileSkeleton() {
    return (
        <>
            <div className="w-full text-center flex flex-col gap-2 items-center mt-8">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-5 w-[250px]" />

                <div className="mt-4">
                    <Skeleton className="h-8 w-32 rounded-full" />
                </div>
            </div>

            <div className="w-full mt-8 flex flex-col gap-8 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-[110px]" />
                    <Skeleton className="h-5 w-[250px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-[110px]" />
                    <Skeleton className="h-5 w-[250px]" />
                </div>
            </div>
        </>
    )
}