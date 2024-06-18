import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { addDays, endOfMonth, format, startOfMonth } from "date-fns"
import React from "react"
import {Calendar as CalendarIcon} from "lucide-react"
import { fr } from "date-fns/locale"
import CalendarCustomDayContent from "@/components/ui/calendar-custom-day-content"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"



export default function DeliveriesOverview() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    })
    const [month, setMonth] = React.useState<{from: string, to: string}>({
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString()
    })

    const {commands} = useGetAllCommands({
        filters: {
            from: month.from, 
            to: month.to
        }
    })
    console.log("commands", commands)
    const handleMonthChange = (e: Date) => {
        setMonth({
            from: e.toISOString(), 
            to: endOfMonth(e).toISOString()
        })
    }

  return (
    <div className="w-full flex-1 rounded-t-3xl px-4 bg-white py-8">
        <div className="w-full mb-4">
            <h3 className="text-2xl">Date</h3>
            <div className="text-sm flex items-center gap-2 text-gray-500 font-light">
                <CalendarIcon size={16}/> 
                {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y", {locale: fr})} -{" "}
                        {format(date.to, "LLL dd, y", {locale: fr})}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y", {locale: fr})
                    )
                    ) : (
                    <span>Sélectionner une date ou un interval</span>
                )}
                
            </div>
        </div>
        <Calendar
            locale={fr}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            onMonthChange={handleMonthChange}
            selected={date}
            onSelect={setDate}
            components={{
                DayContent: CalendarCustomDayContent
            }}
        />
    </div>
  )
}
