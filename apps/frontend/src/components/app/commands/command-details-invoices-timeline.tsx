import { Button } from "@/components/ui/button"
import { useGetAllCommandInvoices } from "@/lib/hooks/use-cases/invoices/useGetCommandInvoices"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye } from "lucide-react"

type CommandDetailsInvoicesTimelineProps = {
    commandId: number
}

export const CommandDetailsInvoicesTimeline = ({commandId}: CommandDetailsInvoicesTimelineProps) => {
    const { commandInvoices, isInvoicesLoading } = useGetAllCommandInvoices({commandId})
    return (
        <div className="space-y-4">
            <h3 className="text-gray-400">Historique des paiements</h3>
            <ul className="flex flex-col">

            {
                isInvoicesLoading ? <p>loading ...</p>
                : commandInvoices &&
                (
                    commandInvoices.map((invoice) => (
                        <li key={invoice.code} className="flex gap-3 items-start">
                            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                            <div className="flex flex-col text-sm">
                                <span className="text-sm text-gray-300">{formatDate((invoice.createdAt as Date).toString(), "dd/MM/yyyy", {locale: fr})}</span>
                                <p className="mt-1">Montant versé: {invoice.amountPaid}</p>
                                <p className="mt-1">Facture n°{invoice.code}</p>
                                <Button variant="link" className="justify-start text-blue-500 mt-3 flex items-center gap-1 p-0 h-min"><Eye size={14} className=""/> <span className="">Afficher la facture</span></Button>
                            </div>
                        </li>
                    ))
                )
            }
            </ul>
        </div>
    )
}