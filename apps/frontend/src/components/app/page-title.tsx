import { MoveLeft } from "lucide-react"
import { NavLink } from "react-router-dom"

type PageTitleProps = {
    pageName: string
    backlink?: string,
    children?: React.ReactNode
    creationDrawer?: React.ReactNode
}

export default function PageTitle({ pageName, backlink, creationDrawer }: PageTitleProps) {

    return (
        <>
            {backlink ?
                <div className="w-full flex items-center space-x-2 p-2 text-lg font-medium" >
                    <NavLink className="" to={backlink}>
                        <MoveLeft size={20} />
                    </NavLink>
                    <span>{pageName}</span>
                </div>
                :
                <div className="w-full flex flex-row items-center px-2">
                    <span className="text-lg font-medium grow text-center">{pageName}</span>
                    {creationDrawer}
                </div>
            }
        </>
    )
}