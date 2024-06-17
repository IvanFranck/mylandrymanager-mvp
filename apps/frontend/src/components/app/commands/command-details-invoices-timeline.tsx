import { Button } from "@/components/ui/button"
import { useGetAllCommandInvoices } from "@/lib/hooks/use-cases/invoices/useGetCommandInvoices"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import { BadgeInfo, Eye, Plus } from "lucide-react"
import { CommandNewPaiementDrawer } from "./command-new-paiement-drawer"
import { API_ROUTES } from "@/common/constants/api-routes"

type CommandDetailsInvoicesTimelineProps = {
    commandId: number
    advance: number,
    price: number,
}

export const CommandDetailsInvoicesTimeline = ({commandId, price, advance}: CommandDetailsInvoicesTimelineProps) => {
    const { commandInvoices, isInvoicesLoading } = useGetAllCommandInvoices({commandId})
    
    const apiBaseURL = import.meta.env.VITE_API_BASE_URL
    console.log(apiBaseURL)
    
    return (
        <div className="space-y-4">
            <h3 className="text-gray-400">Historique des paiements</h3>
            <ul className="flex flex-col space-y-5">
                {
                    isInvoicesLoading ? <p>loading ...</p>
                    : commandInvoices &&
                    (
                        commandInvoices.map((invoice) => (
                            <li key={invoice.code} className="flex gap-3 items-start">
                                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                                <div className="flex flex-col text-sm">
                                    <span className="text-sm font-normal text-gray-400 leading-none">{formatDate((invoice.createdAt as Date).toString(), "dd/MM/yyyy", {locale: fr})}</span>
                                    <p className="mt-1">Montant versé: <span className="font-semibold">{invoice.amountPaid} fcfa</span></p>
                                    <p className="mt-1">Facture n° {invoice.code}</p>
                                    <a href={`${apiBaseURL}${API_ROUTES.INVOICES}/${invoice.code}`} target="_blank">
                                        <Button variant="link" className="justify-start font-normal text-blue-400 mt-3 flex items-center gap-1 p-0 h-min">
                                            <Eye size={14} className=""/> <span className="">Afficher la facture</span>
                                        </Button>
                                    </a>
                                </div>
                            </li>
                        ))
                    )
                }
            </ul>
            
            


            {
                (price > advance) && (
                    <>
                        <CommandNewPaiementDrawer
                            commandId={commandId}
                            rest={price - advance}
                        >
                            <div className="flex items-center gap-2 p-0 text-blue-500">
                                <div className="rounded-full bg-transparent border-2 border-blue-600 border-dashed p-[2px]">
                                    <Plus size={12} color="#2563EB"/>
                                </div>
                                <p className="text-sm font-base ">Enregristrer un nouveau paiement</p>
                            </div>
                        </CommandNewPaiementDrawer>
                        <div className="w-full flex justify-between border border-red-500 bg-red-200 p-4 items-center rounded-md gap-2">
                            <BadgeInfo size={20} color="#DD1313" /> <p className="flex-1 text-center text-gray-600 text-md font-base">Reste à payer: <span className="text-lg text-black  font-bold">{price - advance} Fcfa</span></p>
                        </div>
                    </>
                )
            }
        </div>
    )
}