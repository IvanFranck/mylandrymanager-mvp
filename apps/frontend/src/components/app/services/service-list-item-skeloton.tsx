import { Skeleton } from "@/components/ui/skeleton";

export function ServiceListItemSkeleton() {
    return (
        <div className="mt-4 space-y-6">
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex justify-between items-start flex-row">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))
            }
        </div>
    )
}