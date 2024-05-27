import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CommandStatusType =
    | "Terminé"
    | "Annulé"
    | "En cours"

export interface CommandListItemProps {
    commandId: string,
    price: string,
    customerName: string,
    status: CommandStatusType,
    date: string,
}

export const CommandListItem = ({ commandId, price, customerName, status, date }: CommandListItemProps) => {

    // const handleCLick = () => {

    // }

    return (

        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                    <span>{commandId}</span>
                    <span>{price} Fcfa</span>
                </CardTitle>
                <CardDescription className="text-md text-gray-500">{customerName}</CardDescription>
            </CardHeader>
            <CardContent className="">
                <span
                    className={`
                        ${status === 'En cours' ? "text-blue-500" : ""} 
                        ${status === 'Annulé' ? "text-red-500" : ""}
                        ${status === 'Terminé' ? "text-green-500" : ""}
                    `}
                >
                    {status}
                </span>
                <p className="text-gray-400 text-xs">{date}</p>
            </CardContent>
        </Card>
    )
}