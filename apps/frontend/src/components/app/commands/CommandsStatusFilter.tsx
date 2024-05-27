import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

export const CommandsStatusFilter = () => {

    return (
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="en cours">En cours</TabsTrigger>
                <TabsTrigger value="terminé">Terminé</TabsTrigger>
                <TabsTrigger value="annulé">Annulé</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}