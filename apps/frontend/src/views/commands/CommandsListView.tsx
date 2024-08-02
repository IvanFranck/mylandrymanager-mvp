import { CommandListItem } from "@/components/app/commands/CommandListItem"
import { CommandsStatusFilter } from "@/components/app/commands/CommandsStatusFilter"
import { CommandListSkeleton } from "@/components/app/commands/command-list-skeleton"
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration"
import { Input } from "@/components/ui/input"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"
import { CommandStatus } from "@/lib/types/entities"
import { useEffect, useState } from "react"


export const CommandsListView = () => {

    const [ statusFilter, setStatusFilter ] = useState<CommandStatus | undefined>(undefined)
    const { commands, isFecthing } = useGetAllCommands({filters: {status: statusFilter}})

    useEffect(()=>{

    }, [statusFilter])
    return (

        <div className="w-full flex flex-col space-y-3 px-2 mt-2">
            <div className="w-full flex items-center space-x-2 mb-4">
                <Input className="bg-white" type="search" placeholder="Retrouver une facture par son code" />
            </div>

            <CommandsStatusFilter status={statusFilter} setStatus={setStatusFilter} />

            <div className="w-full grid gap-2">
                {isFecthing
                    ? <CommandListSkeleton />
                    : commands && commands.length ? commands.map((command, index) => (
                        <CommandListItem
                            key={index}
                            command={command}
                        /> 
                    )) : <NoDataIllustration text={statusFilter ? "Aucune commande correspondante à ce filtre n'a été trouvée" : "Oops! Vous n'avez aucune commande enregistrée."}/>
                }

            </div>
        </div >
    )
}