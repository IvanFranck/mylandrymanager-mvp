import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesEntity } from "@/lib/types/entities";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HTMLProps } from "react"

interface ServServiceListItemProps {
    service: ServicesEntity,
    onDelete?: (id: number) => void
    simple?: boolean,
}

export function ServiceListItem({ service, onDelete, simple, ...props }: ServServiceListItemProps & HTMLProps<HTMLDivElement>) {

    const navigate = useNavigate()

    return (

        <Card className={`bg-inherit rounded-none shadow-none border-b-slate-300 ${props.className}`}>
            <CardHeader className="px-2 py-5">
                {
                    !simple && onDelete
                        ? <CardTitle className=" flex justify-between items-start">
                            <div className="w-full">
                                <h2 className="text-lg font-medium mb-2">{service.label}</h2>
                                {service.description && <p className="text-gray-500 font-normal mb-1">{service.description}</p>}
                                <span className="text-sm font-medium">{service.price} Fcfa</span>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger className=" shadow-none bg-slate-200 w-18 h-18 flex justify-center items-center p-1">
                                    <MoreHorizontal color="#384A61" size={18} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="font-normal text-sm mr-3 bg-gray-100 border border-gray-300 rounded-sm text-gray-600">
                                    <DropdownMenuItem className="flex flex-row items-center">
                                        <Button onClick={() => onDelete(service.id)} variant='ghost' className="space-x-2">
                                            <Trash2 size={14} />
                                            <span>Supprimer</span>
                                        </Button>
                                        {/* <ConfirmActionDialog TriggerNode={TriggerServiceDeletionButton()} /> */}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex flex-row items-center space-x-2">
                                        <Button onClick={() => navigate(`/services/edit/${service.id}`)} variant='ghost' className="space-x-2">
                                            <SquarePen size={14} /><span>Modifier</span>
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </CardTitle>
                        : <CardTitle className="font-normal  mb-2 ">
                            {service.label}
                        </CardTitle>

                }
            </CardHeader>
        </Card>
    )
}