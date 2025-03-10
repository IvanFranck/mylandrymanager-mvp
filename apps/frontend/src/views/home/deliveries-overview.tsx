import { Calendar } from "@/components/ui/calendar"
import { endOfMonth, isSameDay, startOfMonth } from "date-fns"
import React, { useEffect, useState } from "react"
import { fr } from "date-fns/locale"
import { useGetAllCommands } from "@/lib/hooks/use-cases/commands/useGetAllCommands"
import { DayMouseEventHandler, Matcher } from "react-day-picker"
import { CommandDeliveryListItem } from "@/components/app/commands/command-delivery-list-item"
import { CommandsEntity } from "@/lib/types/entities"
import './delivery-date.css'

export default function DeliveriesOverview() {
    const [date, setDate] = React.useState<Date>()
    const [month, setMonth] = React.useState<{from: string, to: string}>({
        from: startOfMonth(new Date()).toISOString(),
        to: endOfMonth(new Date()).toISOString()
    })
    const [deliveryDays, setDeliveryDays] = useState<Matcher[] | undefined>()
    const [deliveryCommands, setDeliveryCommands] = useState<CommandsEntity[] | undefined>()
    const {commands} = useGetAllCommands({
        filters: {
            from: month.from, 
            to: month.to
        }
    })
    useEffect(()=>{
        if(commands && commands.length){
            const dates = commands.map((date)=> new Date(date.withdrawDate))
            setDeliveryDays(dates)
        }else{
            setDeliveryCommands(undefined)
        }
    }, [commands])

    const handleMonthChange = (e: Date) => {
        setMonth({
            from: e.toISOString(), 
            to: endOfMonth(e).toISOString()
        })
    }

    const handleDayClick: DayMouseEventHandler = (day, {booked}) => {
        if(booked){
            setDeliveryCommands(commands?.filter((command) => {
                return isSameDay(new Date(command.withdrawDate), day)
            }))
        }else{
            setDeliveryCommands(undefined)
        }
    }

  return (
    <div className="w-full flex-1 rounded-t-3xl py-2">
        <div className="w-full mb-4 flex gap-1 items-center">
            <h3 className="text-xl font-semibold">Calendrier des livraisons</h3>
        </div>
        <div className="bg-white px-4 py-6 rounded-md shadow-sm">
            <Calendar
                className="p-0 delivery-calendar"
                locale={fr}
                modifiers={{booked: deliveryDays as Matcher[]}}
                modifiersClassNames={{booked: "delivery-date"}}
                mode="single"
                onMonthChange={handleMonthChange}
                selected={date}
                onSelect={setDate}
                onDayClick={handleDayClick}
            />
        </div>
        <div className="mt-8">
            <div className="flex w-full flex-col gap-3">
                {deliveryCommands && deliveryCommands.map((command) => (
                    <CommandDeliveryListItem key={command.code} command={command}/>
                ))}
            </div>
        </div>
    </div>
  )
}
