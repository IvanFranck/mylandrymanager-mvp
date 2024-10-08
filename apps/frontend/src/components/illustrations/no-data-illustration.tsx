import nodata from "@/assets/no-data-bro.svg"
export function NoDataIllustration({ text }: { text: string }) {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <img src={nodata} className="w-2/3" alt="no data" />
            <h3 className="text-lg font-light text-gray-500 text-center">{text}</h3>
        </div>
    )
}