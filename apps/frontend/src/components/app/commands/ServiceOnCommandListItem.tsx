import { Card, CardContent } from "../../ui/card"

export interface ServiceOnCommandListItemProps {
    serviceName: string
    quantity: number
    price: string
}

export default function ServiceOnCommandListItem({ serviceName, quantity, price }: ServiceOnCommandListItemProps) {

    return (
        <Card>
            <CardContent className="w-full grid grid-cols-7 gap-2 p-4">
                <div className="col-span-5 grid grid-cols-5 gap-1">
                    <p className="text-gray-600 col-span-3 text-ellipsis overflow-hidden">{serviceName}</p>
                    <span className="col-span-2"> x {quantity}</span>
                </div>
                <div className="col-span-2 text-right font-semibold">{price}</div>
            </CardContent>
        </Card>
    )
}