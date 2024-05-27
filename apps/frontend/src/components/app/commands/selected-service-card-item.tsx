import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceOnCommandEntity } from "@/lib/types/entities";
import { HTMLProps } from "react"

type SelectedServiceItemProps = {
    selectedService: ServiceOnCommandEntity
}
export default function SelectedServiceItem({
    selectedService,
    ...props
}: SelectedServiceItemProps & HTMLProps<HTMLDivElement>) {


    return (
        <Card className={props.className}>
            <CardHeader className="">
                <CardTitle className="text-lg flex justify-between">
                    <span className="font-normal">{selectedService.service.label}</span>
                    <strong>{selectedService.quantity * selectedService.service.price} fcfa</strong>
                </CardTitle>
                <CardDescription className="text-gray-600 text-xs">
                    {selectedService.quantity} * {selectedService.service.price}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}