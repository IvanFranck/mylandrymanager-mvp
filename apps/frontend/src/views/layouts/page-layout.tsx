import { Outlet } from "react-router-dom"
import { PagetitleLayout } from "./page-title-layout"
import MobileNavLayout from "./mobile-nav-layout"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export default function PageLayout() {
    return (
        <div className="w-full min-h-screen flex flex-col relative bg-slate-200">
            <PagetitleLayout  />
            <ScrollArea className="w-full mb-[55px] flex-1 flex flex-col">
                <Outlet />
            </ScrollArea>
            <MobileNavLayout />
        </div>
    )
}