import { Calendar } from "@/components/ui/calendar"
import { DayContentProps } from "react-day-picker"
import { endOfMonth, startOfMonth } from "date-fns"
import React from "react"
import { fr } from "date-fns/locale"
import CalendarCustomDayContent from "@/components/ui/calendar-custom-day-content"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"



export default function DeliveriesOverview() {
    const [date, setDate] = React.useState<Date>()
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
    const handleMonthChange = (e: Date) => {
        setMonth({
            from: e.toISOString(), 
            to: endOfMonth(e).toISOString()
        })
    }

  return (
    <div className="w-full flex-1 rounded-t-3xl px-4 bg-white py-8">
        <div className="w-full mb-4 flex gap-1 items-center">
            <h3 className="text-2xl">Date</h3>
        </div>
        <Calendar
            className="p-0"
            locale={fr}
            mode="single"
            onMonthChange={handleMonthChange}
            selected={date}
            onSelect={setDate}
            components={{
                DayContent: (props: DayContentProps) => <CalendarCustomDayContent props={props} commands={commands}/>
            }}
        />
    </div>
  )
}
