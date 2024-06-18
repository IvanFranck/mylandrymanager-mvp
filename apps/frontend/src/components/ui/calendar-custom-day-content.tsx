import { type DayContentProps } from "react-day-picker";

export default function CalendarCustomDayContent (props: DayContentProps) {
    return (
        <span style={{ position: "relative", overflow: "visible" }}>
            {props.date.getDate() === 19 ? ` 🎉` : props.date.getDate()}
        </span>
    )
}