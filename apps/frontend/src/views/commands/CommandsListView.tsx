import { COMMANDS_QUERY_KEY } from "@/common/constants/query-keys"
import { CommandListItem } from "@/components/app/commands/CommandListItem"
import { CommandsStatusFilter } from "@/components/app/commands/CommandsStatusFilter"
import { CommandListSkeleton } from "@/components/app/commands/command-list-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllCommandsQuery } from "@/lib/api/commands"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"


export const CommandsListView = () => {

    const { data: commands } = useQuery({
        queryKey: COMMANDS_QUERY_KEY,
        queryFn: fetchAllCommandsQuery,
        staleTime: 12000
    })
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
                {commands
                    ? commands.map((command, index) => (
                        <CommandListItem
                            key={index}
                            command={command}
                        />
                    ))
                    : <CommandListSkeleton />
                }

            </div>
        </div >
    )
}