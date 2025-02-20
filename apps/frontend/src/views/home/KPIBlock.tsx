type KPIBlockProps = {
    title: string
    value: number
    wrapperClassName?: string
    Icon: React.ReactNode,
    iconClassName?: string
}

export default function KPIBlock({
    title, value, wrapperClassName, Icon, iconClassName
}: KPIBlockProps & React.HTMLProps<HTMLDivElement>) {

    return (
        <div className={`w-full p-4 rounded-md shadow-lg relative overflow-hidden ${wrapperClassName}`}>
            <span className={`p-6 rounded-full w-max block absolute -top-2 -right-2 z-10 ${iconClassName}`}>
                {Icon}
            </span>
            <div className="mr-8 z-20 relative">
                <h3 className="leading-tight  text-white/80 font-light mb-1 h-[2lh]">{title}</h3> 
                <p className="text-md font-semibold text-white">{value}</p>
            </div>
        </div>
    )
}