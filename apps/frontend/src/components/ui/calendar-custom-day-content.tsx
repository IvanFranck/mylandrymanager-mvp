import { CommandsEntity } from "@/lib/types/entities";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { type DayContentProps } from "react-day-picker";

type CalendarCustomDayContentProps = {
    props: DayContentProps,
    commands?: CommandsEntity[]
} 

export default function CalendarCustomDayContent ({props, commands}: CalendarCustomDayContentProps) {
    const commandsDate = commands?.map((command) =>  command.createdAt)
    const [isADeliveryDate, setDeliveryDate] = useState(false)

    useEffect(()=>{
        commandsDate?.forEach((date)=>{
            if(isSameDay(date, props.date)) setDeliveryDate(true)
        })
    })
    return (
        <div className="relative overflow-visible flex flex-col items-center">
            <span>
                {props.date.getDate()}
            </span>
            {isADeliveryDate && <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>}
        </div>
    )
}