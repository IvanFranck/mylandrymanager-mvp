import { CommandsEntity } from "@/lib/types/entities"
import { getCommandStatusVariant } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Link } from "react-router-dom"

type CommandDeliveryListItemProps = {
    command: CommandsEntity
}

export const CommandDeliveryListItem = ({command}: CommandDeliveryListItemProps) => {
    return (
        <Link to={`../../commands/${command.id}`} relative="path">
            <article className=" flex-1  relative before:content-[''] before:absolute before:h-full before:w-1 before:bg-gray-500 before:rounded-sm bg-gray-300/20 pr-2">
                <div className="flex-col flex py-2 ml-3">
                    <div className="flex justify-between items-center">
                        <h5 className="text-md font-bold">CMD {`#${command.code}`}</h5>
                        <span className={`font-medium text-xs ${getCommandStatusVariant(command.status)?.variant}`}>
                            {getCommandStatusVariant(command.status)?.text ?? command.status}
                        </span>
                    </div>
                    <p className="font-light text-[12px] text-gray-500">Commandée le {format(command.createdAt, "dd/MM/yyyy", {locale: fr})}</p>
                    <p className="font-light text-[12px] text-gray-500">par <span className="font-medium"> {command.customer.name}</span></p>
                    <p className="mt-3 text-sm font-light text-gray-500">Total: <span className="font-semibold text-black">{command.price - (command.discount ?? 0)}cfa</span></p>
                </div>
            </article>
        </Link>
    )
}