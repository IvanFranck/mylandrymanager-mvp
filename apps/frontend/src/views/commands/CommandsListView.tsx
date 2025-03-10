import { CommandListItem } from "@/components/app/commands/CommandListItem"
import { CommandsStatusFilter } from "@/components/app/commands/CommandsStatusFilter"
import { CommandListSkeleton } from "@/components/app/commands/command-list-skeleton"
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration"
import { Input } from "@/components/ui/input"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"
import { CommandQueriesType } from "@/lib/types/query.filter.types"
import { useEffect, useState } from "react"


export const CommandsListView = () => {

    const [ filters, setFilters ] = useState<CommandQueriesType | undefined>(undefined)
    const { commands, isFecthing } = useGetAllCommands({filters})
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    useEffect(() => {
        if (debouncedQuery) {
            const newFilters = {
                ...filters,
                code: debouncedQuery
            }
            setFilters(newFilters);
        } else if (debouncedQuery === '') {
            const newFilters = {
                ...filters,
                code: undefined
            }
            setFilters(newFilters);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);
    return (

        <div className="w-full flex flex-col space-y-3 px-2 mt-2">
            <div className="w-full flex items-center space-x-2 mb-4">
                <Input 
                    className="bg-white" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search" 
                    placeholder="Retrouver une commande par son code" 
                />
            </div>

            <CommandsStatusFilter filters={filters} setFilters={setFilters} />

            <div className="w-full grid gap-2">
                {isFecthing
                    ? <CommandListSkeleton />
                    : commands && commands.length ? commands.map((command, index) => (
                        <CommandListItem
                            key={index}
                            command={command}
                        /> 
                    )) : <NoDataIllustration text={filters ? "Aucune commande correspondante à ce filtre n'a été trouvée" : "Oops! Vous n'avez aucune commande enregistrée."}/>
                }

            </div>
        </div >
    )
}
