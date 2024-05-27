import { Calendar } from "@/components/ui/calendar";
import { differenceInCalendarDays, format } from "date-fns"
import { fr } from "date-fns/locale"
import { Dispatch } from "react";

type WithdrawalDateStepProps = {
    date: Date | undefined
    setDate: Dispatch<React.SetStateAction<Date | undefined>>
}

export default function WithdrawalDateStep({ date, setDate }: WithdrawalDateStepProps) {

    // const test = (day: Date | undefined) => {
    //     setDate(day)
    // }

    return (
        <section className=" space-y-2">
            <h3 className="text-lg font-medium">Date de retrait</h3>
            <p className="text-gray-400 font-light text-sm">
                {
                    date
                        ? `${format(date, "dd MMM", { locale: fr })}, dans ${differenceInCalendarDays(date, new Date())} jour${differenceInCalendarDays(date, new Date()) > 1 ? "s" : ""}`
                        : `Sélectionnez la date à laquelle la commande sera prête`
                }
            </p>
            <Calendar
                className="w-[240px] rounded-md border shadow"
                mode="single"
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                selected={date}
            />
        </section>
    )
}