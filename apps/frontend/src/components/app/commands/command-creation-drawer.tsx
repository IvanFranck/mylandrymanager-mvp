import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"
import { CustomerStep } from "./multistep-creation-form/customer-step";
import { ServiceStep } from "./multistep-creation-form/service-step";
import { CustomersEntity, ServiceOnCommandEntity } from "@/lib/types/entities";
import DiscountStep from "./multistep-creation-form/discount-step";
import WithdrawalDateStep from "./multistep-creation-form/withdrawal-date-step";
import DescriptionStep from "./multistep-creation-form/description-step";
import { z } from "zod";
import { CommandSchema } from "@/lib/api/commands";
import AdvanceStep from "./multistep-creation-form/advance-step";
import { useCreateCommand } from "@/lib/hooks/use-cases/commands/useCreateCommand";

export function CommandCreationDrawer() {

    const [isOpen, setOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<CustomersEntity | undefined>()
    const [selectedServices, setSelectedServices] = useState<ServiceOnCommandEntity[] | []>([])
    const [billingPrice, setBillingPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [advance, setAdvance] = useState(0)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (selectedServices.length === 0) setDiscount(0)
        const total = selectedServices.reduce((prev, curr) => prev + curr.service.price * curr.quantity, 0)
        setBillingPrice(total)
    }, [selectedServices])

    const reset = () => {
        setSelectedServices([])
        setDiscount(0)
        setSelectedCustomer(undefined)
        setDate(undefined)
        setDescription('')
    }

    const cancel = useCallback(() => {
        setOpen(!isOpen)
        reset()
    }, [isOpen])

    const {createCommand, creatingCommand, createCommandSucced} = useCreateCommand()

    if(createCommandSucced){
        cancel()
    }


    const save = async () => {
        const data: z.infer<typeof CommandSchema> = {
            description,
            discount,
            advance,
            customerId: selectedCustomer?.id || 0,
            withdrawDate: date ? date.toISOString() : new Date().toISOString(),
            services: selectedServices.map(service => ({
                service: {
                    ...service.service,
                },
                quantity: service.quantity
            }))
        }
        await createCommand(data)
    }

    

    return (
        <>
            <Button variant='ghost' className="p-0">
                <Plus className="grow-0 text-blue-600" size={24} onClick={cancel} />
            </Button>

            <AnimatePresence>
                {
                    isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 600 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 600 }}
                            transition={{ duration: 0.3 }}
                            className="absolute z-10 top-0 left-0 right-0 min-h-screen w-full"
                        >
                            <div className="min-h-svh w-full bg-white flex flex-col overflow-auto">
                                <div className="w-full">
                                    <Header onClose={() => setOpen(false)} />
                                </div>
                                <div className="w-full flex flex-col space-y-1 bg-green-600 px-4 py-2">
                                    <span className="text-gray-200">Total</span>
                                    <h3 className="text-3xl font-bold text-white">
                                        {
                                            discount > 0
                                                ? <p className="flex items-center">
                                                    <span className="text-lg line-through text-gray-300 font-normal mr-2">{billingPrice} fcfa</span>
                                                    <span>{billingPrice - discount} fcfa</span>
                                                </p>
                                                : `${billingPrice} Fcfa`
                                        }
                                    </h3>
                                </div>

                                <div className="w-full flex flex-col bg-white">
                                    <div className="w-full grow text-black px-4 space-y-6 mt-4">
                                        {
                                            <ServiceStep
                                                selectedServices={selectedServices}
                                                setSelectedServices={setSelectedServices}
                                            />
                                        }
                                        {selectedServices.length > 0 && <CustomerStep selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />}
                                        {
                                            selectedCustomer &&
                                            <DiscountStep billingPrice={billingPrice} setDiscount={setDiscount} discount={discount} />
                                        }
                                        {
                                            selectedCustomer && 
                                            <AdvanceStep advance={advance} setAdvance={setAdvance} billingPrice={billingPrice}/>
                                        }
                                        {selectedCustomer && <WithdrawalDateStep date={date} setDate={setDate} />}
                                        {selectedCustomer && <DescriptionStep description={description} setDescription={setDescription} />}
                                        {

                                            date && selectedCustomer && <div className="w-full flex flex-col">
                                                <Button
                                                    disabled={creatingCommand}
                                                    className="bg-green-600 py-6 space-x-2 mb-8"
                                                    onClick={save}
                                                >
                                                    <span className="text-lg">Valider - </span>
                                                    <span className="font-bold text-2xl">{billingPrice - discount} fcfa</span>
                                                    {creatingCommand && <Loader size={18} className="animate-spin" />}
                                                </Button>
                                            </div>
                                        }
                                    </div>

                                    {/* <div className="grow-0 w-full flex flex-row justify-between">
                                        <Button disabled={currentStep <= 1} onClick={() => setCurrentStep(currentStep - 1)} variant="secondary" className="rounded-none bg-red-500 rounded-tr-2xl px-3 py-6">
                                            <ChevronLeft size={28} strokeWidth={2} className="text-white" />
                                        </Button>
                                        <Button onClick={() => setCurrentStep(currentStep + 1)} variant="secondary" className="rounded-none bg-red-500 rounded-tl-2xl px-3 py-6">
                                            <ChevronRight size={28} strokeWidth={2} className="text-white" />
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                        </motion.div>

                    )
                }
            </AnimatePresence>
        </>
    )
}

function Header({ onClose }: { onClose: () => void }) {
    return (
        <div className="w-full px-4 py-5 flex flex-row items-center justify-between text-lg font-medium">
            <Button variant='ghost' className="p-0 grow-0">
                <X className="text-blue-600" onClick={onClose} size={24} />
            </Button>
            <h2 className="grow text-center text-black">Création d'une commande</h2>
        </div>
    )
}