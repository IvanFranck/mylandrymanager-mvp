import { Outlet } from "react-router-dom"
import { PagetitleLayout } from "./page-title-layout"
import MobileNavLayout from "./mobile-nav-layout"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export default function PageLayout() {
    return (
        <div className="w-full min-h-screen relative bg-slate-200">
            <PagetitleLayout />
            <ScrollArea className="w-full mb-[55px] pb-2 ">
                <Outlet />
            </ScrollArea>
            <MobileNavLayout />
        </div>
    )
}