import { CommandStatus } from "@/lib/types/entities"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

type CommandsStatusFilterProps = {
    status?: CommandStatus
    setStatus:  React.Dispatch<React.SetStateAction<CommandStatus | undefined>>
}

export const CommandsStatusFilter = ({status, setStatus}: CommandsStatusFilterProps) => {

    return (
        <Tabs defaultValue={status ?? 'all'}className="w-full">
            <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger onClick={()=>setStatus(undefined)} value="all">Toutes</TabsTrigger>
                <TabsTrigger onClick={()=>setStatus('PAID')} value="PAID">Réglées</TabsTrigger>
                <TabsTrigger onClick={()=>setStatus('PENDING')} value="PENDING">En cours</TabsTrigger>
                <TabsTrigger onClick={()=>setStatus('NOT_PAID')} value="NOT_PAID">Non réglées</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}