import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CommandListSkeleton() {
    return (
        Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-1/5" />
                    </CardTitle>
                    <Skeleton className="h-4 w-2/5" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-2 w-1/5" />
                </CardContent>
            </Card>
        ))
    )
}