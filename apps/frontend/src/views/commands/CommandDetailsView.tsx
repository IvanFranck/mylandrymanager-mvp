import '@/bill.css'
import { COMMANDS_QUERY_KEY, COMMAND_ID_QUERY_KEY } from '@/common/constants/query-keys'
import { fetchCommandById } from '@/lib/api/commands'
import { CommandsEntity } from '@/lib/types/entities'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useParams } from 'react-router-dom'

export const CommandDetailView = () => {
    const { commandId } = useParams()
    const queryClient = useQueryClient()

    const { data: command, isLoading } = useQuery({
        queryKey: COMMAND_ID_QUERY_KEY(+commandId),
        queryFn: async () => await fetchCommandById(commandId ? +commandId : 0),
        staleTime: 12000,
        placeholderData: () => {
            const commands: CommandsEntity[] | undefined = queryClient.getQueryData(COMMANDS_QUERY_KEY)
            return commandId ? commands?.find(command => command.id === +commandId) : undefined
        }
    })

    return (
        <div className="w-full px-2 mt-4">
            {
                isLoading
                    ? <p>loading ...</p>
                    :
                    <div className="border bg-white border-gray-200 rounded-md p-4">
                        {/* header */}
                        <div className="w-full flex justify-between">
                            <div>
                                <h2 className="text-xl text-center font-medium">PRESSING 2k</h2>
                                <p className="text-gray-400 font-normal">{command?.customer.name}</p>
                            </div>
                            <span className="font-normal text-sm">{command?.code.code}</span>
                        </div>

                        {/* services */}
                        <div className='w-full mt-6'>
                            <ol className='w-full list'>
                                {command?.services && command.services.map(({ service, quantity }) => (
                                    <li key={service.id} className='w-full list-decimal flex justify-between border-b-2 border-dashed mb-4'>
                                        <p className='text-gray-400 flex items-center font-normal'>
                                            {service.label}
                                            <span className='ml-1 flex items-center'><X size={18} />{quantity}</span>
                                        </p>
                                        <span className="text-md text-gray-600 font-normal">{quantity * service.price} fcfa</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* prices */}
                        <div className='w-full space-y-4 mt-3'>
                            <div className='w-full flex justify-between items-center'>
                                <p className='font-normal'>Total</p>
                                <span className='font-medium text-gray-800'> {command?.services.reduce((acc, { quantity, service }) => acc + (service.price * quantity), 0)} fcfa</span>
                            </div>
                            <div className='w-full flex justify-between items-center'>
                                <p className='font-normal'>Remise</p>
                                <span className='font-medium text-red-600'> - {command?.discount ? command.discount : 0} fcfa</span>
                            </div>
                            <div className='w-full flex justify-end font-semibold text-xl text-green-600'>{command?.price} fcfa</div>
                        </div>
                    </div>
            }
        </div>
    )
}