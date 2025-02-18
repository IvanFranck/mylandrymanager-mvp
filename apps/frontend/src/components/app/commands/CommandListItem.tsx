import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CommandsEntity } from "@/lib/types/entities"
import { getCommandStatusVariant } from "@/lib/utils"
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
            <CardHeader className="pb-0">
                <CardTitle className="text-lg flex justify-between">
                    <span>{command.customer.name}</span>
                    <div className="flex flex-col space-y-1">
                        <span>{command.price - (command.discount ?? 0) } Fcfa</span>
                        <span className={`border font-medium text-xs text-center ${getCommandStatusVariant(command.status)?.variant} px-4 py-1 rounded-full`}>
                            {getCommandStatusVariant(command.status)?.text ?? command.status}
                        </span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-6 -mt-6">
                <ul className="flex flex-col space-y-1 text-sm font-light text-gray-400">
                    { command.services.map((item, index) => (
                        <li className="italic " key={index}>{item.quantity} x {item.service.label}</li>
                    ))}
                </ul>
                <p className=" mt-4">Facture <strong>N° {command.code}</strong></p>
            </CardContent>
            <CardFooter className=""> 
                <p className="text-sm text-gray-400">À rétirer le {formatDate(command.withdrawDate, "dd MMM", { locale: fr })}</p>
            </CardFooter>
        </Card>
    )
}