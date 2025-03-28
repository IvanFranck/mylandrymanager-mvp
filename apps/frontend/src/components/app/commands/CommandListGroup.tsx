import { CommandListItem } from "./CommandListItem"
import { CommandsEntity } from "@/lib/types/entities"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type CommandListGroupProps = {
    date: Date
    commands: CommandsEntity[]
}

export const CommandListGroup = ({ date, commands }: CommandListGroupProps) => {
    const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr })
    
    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">
                        {formattedDate}
                    </span>
                </div>
            </div>
            <div className="w-full grid gap-2">
                {commands.map((command, index) => (
                    <CommandListItem
                        key={index}
                        command={command}
                    />
                ))}
            </div>
        </div>
    )
} 