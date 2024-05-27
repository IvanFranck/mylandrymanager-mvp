import { MoveLeft } from "lucide-react"
import { NavLink } from "react-router-dom"

type PageTitleProps = {
    pageName: string
    backlink?: string,
    children?: React.ReactNode
    creationDrawer?: React.ReactNode
    editionDrawer?: React.ReactNode
}

export default function PageTitle({ pageName, backlink, creationDrawer, editionDrawer }: PageTitleProps) {

    return (
        <>
            {backlink ?
                <div className="w-full flex items-center space-x-2 text-lg font-medium" >
                    <NavLink className="text-blue-600 grow-0" to={backlink}>
                        <MoveLeft size={20} />
                    </NavLink>
                    <div className={`grow ${editionDrawer ? 'flex items-center' : 'text-center'} `}>
                        <span className="grow text-center">{pageName}</span>
                        {editionDrawer && (
                            <div className="grow-0">
                                {editionDrawer}
                            </div>
                        )}
                    </div>
                </div>
                :
                <div className="w-full flex flex-row items-center px-2">
                    <h2 className="text-lg font-medium grow text-center">{pageName}</h2>
                    {creationDrawer}
                </div>
            }
        </>
    )
}