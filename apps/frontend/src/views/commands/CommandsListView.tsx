import { CommandListItem } from "@/components/app/commands/CommandListItem"
import { CommandsStatusFilter } from "@/components/app/commands/CommandsStatusFilter"
import { CommandListSkeleton } from "@/components/app/commands/command-list-skeleton"
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"
import { Plus } from "lucide-react"


export const CommandsListView = () => {

    const { commands, isFecthing } = useGetAllCommands()
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
                {isFecthing
                    ? <CommandListSkeleton />
                    : commands ? commands.map((command, index) => (
                        <CommandListItem
                            key={index}
                            command={command}
                        /> 
                    )) : <NoDataIllustration text={"Oops! Vous n'avez aucune commande enregistrée."}/>
                }

            </div>
        </div >
    )
}