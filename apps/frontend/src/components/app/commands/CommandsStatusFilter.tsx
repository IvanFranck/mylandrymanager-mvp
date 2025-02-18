import { CommandStatus } from "@/lib/types/entities"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { CommandQueriesType } from "@/lib/types/query.filter.types"

type CommandsStatusFilterProps = {
    filters?: CommandQueriesType
    setFilters:  React.Dispatch<React.SetStateAction<CommandQueriesType | undefined>>
}

export const CommandsStatusFilter = ({filters, setFilters}: CommandsStatusFilterProps) => {
    const handleChange = (value: CommandStatus | undefined) => {
        const newStatus = {
            ...filters,
            status: value
        }
        setFilters(newStatus);
    }
    return (
        <Tabs defaultValue='all' className="w-full">
            <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger onClick={()=>handleChange(undefined)} value="all">Toutes</TabsTrigger>
                <TabsTrigger onClick={()=>handleChange('PAID')} value="PAID">Réglées</TabsTrigger>
                <TabsTrigger onClick={()=>handleChange('PENDING')} value="PENDING">En cours</TabsTrigger>
                <TabsTrigger onClick={()=>handleChange('NOT_PAID')} value="NOT_PAID">Non réglées</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}