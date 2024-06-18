import '@/bill.css'
import { COMMANDS_QUERY_KEY, COMMAND_ID_QUERY_KEY } from '@/common/constants/query-keys'
import { CommandDetailsInvoicesTimeline } from '@/components/app/commands/command-details-invoices-timeline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchCommandById } from '@/lib/api/commands'
import { CommandsEntity, CustomersEntity } from '@/lib/types/entities'
import { getCommandStatusVariant, getInitials } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronRight, X } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

export const CommandDetailView = () => {
    const { commandId } = useParams<{ commandId: string }>();
    const numericCommandId = Number(commandId) || 0; // Fallback to 0 if commandId is undefined or not a number
    const queryClient = useQueryClient()

    const { data: command, isLoading } = useQuery({
        queryKey: COMMAND_ID_QUERY_KEY(numericCommandId),
        queryFn: async () => await fetchCommandById(numericCommandId),
        staleTime: 12000,
        placeholderData: () => {
            const commands: CommandsEntity[] | undefined = queryClient.getQueryData(COMMANDS_QUERY_KEY)
            return numericCommandId ? commands?.find(command => command.id === numericCommandId) : undefined
        },
        enabled: numericCommandId > 0,
    })

    const commandServices = useMemo(() => command?.services, [command])

    return (
        <div className="w-full rounded-t-3xl bg-white overflow-hidden flex-1 mt-4">
            {
                isLoading
                    ? <p>loading ...</p>
                    : command &&
                    <div className="p-4 pt-6">
                        {/* command status */}
                        <div className='w-full flex justify-between'>
                            <span className={`border font-medium text-xs ${getCommandStatusVariant(command.status)?.variant} px-4 py-1 rounded-full`}>
                                {getCommandStatusVariant(command.status)?.text ?? command.status}
                            </span>
                        </div>

                        {/* header */}
                        <div className="w-full flex flex-col gap-4 mt-4">
                            <div className='w-full'>
                                <h2 className="text-xl text-left font-semibold">CMD #{command.code ?? 'N/A'}</h2>
                                <p className='text-sm text-gray-400 mt-2'>
                                    Attendue le {formatDate((command.withdrawDate as Date).toString(), "dd/MM/yyyy", {locale: fr})}
                                </p>
                            </div>

                            <CommandOwnerCard customer={command.customer} date={command.createdAt as Date}/>
                        </div>

                        {/* bill */}
                        <div className='w-full mt-6 bg-gray-100 pt-3 rounded-lg flex flex-col gap-8 mb-6'>
                            {/* services details */}
                            <CommandBillSection title='Détails des services'>
                                <div className='w-full flex flex-col gap-4'>
                                    {commandServices && commandServices.map(({ service, quantity }) => (
                                        <div key={service.id} className='w-full flex justify-between'>
                                            <div className='flex flex-col font-normal'>
                                                <h5 className='font-semibold '>{service.label}</h5>
                                                <span className='text-xs text-gray-400 flex items-end mt-1'>Qté {quantity} <X size={14} /> {service.price} fcfa</span>
                                            </div>
                                            <span className="text-sm font-semibold">{quantity * service.price} fcfa</span>
                                        </div>
                                        ))
                                    }
                                </div>
                            </CommandBillSection>

                            {/* total details */}
                            <CommandBillSection title='Détails de paiement'>
                                <div className='w-full mb-4 flex justify-between'>
                                    <p className='text-sm text-gray-400'>Total partiel</p>
                                    <p className='text-sm font-semibold'>{command.price} fcfa</p>
                                </div>
                                <div className='w-full text-blue-500 mb-4 flex justify-between'>
                                    <p className='text-sm '>Remise</p>
                                    <p className='text-sm font-semibold'>- {command?.discount ??  0} fcfa</p>
                                </div>
                            </CommandBillSection>

                            <div className='w-full px-3 py-5 bg-blue-200 rounded-b-lg'>
                                <div className='w-full flex justify-between font-semibold'>
                                    <p>Total</p>
                                    <p>{command.price - (command.discount ?? 0)} fcfa</p>
                                </div>
                            </div>
                        </div>

                        {/** command paiements timeline */}
                        <CommandDetailsInvoicesTimeline 
                            commandId={numericCommandId} 
                            advance={command.advance} 
                            price={command.price - (command.discount ?? 0)}
                        />
                    </div>
            }
        </div>
    )
}

const CommandOwnerCard = ({customer, date}: {customer: CustomersEntity | undefined, date: Date}) => {
    return (
        customer ? (
            <Link to={`/customers/${customer.id}`}>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                <Avatar>
                    <AvatarImage src="https://avatar.iran.liara.run/public" />
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-400">
                        Commandé par:
                    </p>
                    <p className="text-sm font-semibold leading-none">
                        {customer.name}
                    </p>
                    <p className='text-xs text-gray-400'>
                        le {formatDate(date.toString(), "dd/MM/yyyy", {locale: fr})}
                    </p>
                </div>
                <ChevronRight/>
                </div>
            </Link>
        ) : null
    )
}   


const CommandBillSection = ({title, children}: {title: string, children: React.ReactNode}) =>{
    return (
        <div className='w-full px-3 '>
            <div className='w-full'>
                <p className='font-semibold text-xs pb-3 border-b-2 border-dashed'>{title}</p>
                <div className='mt-3'>
                    {children}
                </div>
            </div>
        </div>
    )
}