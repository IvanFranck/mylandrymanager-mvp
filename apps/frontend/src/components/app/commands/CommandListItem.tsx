import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CommandsEntity } from "@/lib/types/entities"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import { useNavigate } from "react-router-dom"


export interface CommandListItemProps {
    command: CommandsEntity
}

export const CommandListItem = ({ command }: CommandListItemProps) => {

    const navigate = useNavigate()

    return (

        <Card onClick={() => navigate(`/commands/${command.id}`)} className="cursor-pointer">
            <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                    <span>{command.code.code}</span>
                    <span>{command.price} Fcfa</span>
                </CardTitle>
                <CardDescription className="text-md text-gray-500">{command.customer.name}</CardDescription>
            </CardHeader>
            <CardContent className="">
                <p className="text-gray-400 text-xs">À rétirer: {formatDate(command.withdrawDate, "dd MMM", { locale: fr })}</p>
            </CardContent>
        </Card>
    )
}