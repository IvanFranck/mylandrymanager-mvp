import { CommandListItem, CommandListItemProps } from "@/components/app/commands/CommandListItem"
import { CommandsStatusFilter } from "@/components/app/commands/CommandsStatusFilter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

const commands: CommandListItemProps[] = [
    {
        commandId: "12673A4",
        price: "3400",
        customerName: "NZIMA YENGUE IVAN",
        status: "En cours",
        date: "Oct 17, 2023"
    },
    {
        commandId: "89D00A1",
        price: "7800",
        customerName: "JOHN DOE",
        status: "Annulé",
        date: "Oct 18, 2023"
    }
]

export const CommandsListView = () => {
    return (

        <div className="w-full flex flex-col space-y-3 px-2 mt-2">
            <div className="w-full flex items-center space-x-2 mb-4">
                <Input className="bg-white" type="search" placeholder="Rechercher" />
                <Button className="flex items-center space-x-1" type="submit">
                    <span>Nouveau</span>
                    <Plus size={16} strokeWidth={3} />
                </Button>
            </div>

            <CommandsStatusFilter />

            <div className="w-full grid gap-2">
                {commands.map((command, index) => (
                    <CommandListItem
                        key={index}
                        {...command}
                    />

                ))}
            </div>
        </div >
    )
}