import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerListSkeleton() {
    return (
        <div className="mt-4 space-y-5">
            {
                Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-[260px]" />
                ))
            }
        </div>
    )
}