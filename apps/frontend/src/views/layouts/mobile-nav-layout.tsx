import { HandCoins, Home, ReceiptText, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileNavLayout() {

    return (
        <div className="fixed bottom-0 h-[55px] flex items-center border backdrop-blur-xl bg-white/50 w-full">
            <div className="w-full flex items-center justify-around">
                <NavLink to="/home">
                    {(link) => <Home color="#223042" fill={link.isActive ? "#7391B7" : "#FFF"} />}
                </NavLink>
                <NavLink to="/commands">
                    {(link) => <ReceiptText color="#223042" fill={link.isActive ? "#7391B7" : "#FFF"} />}
                </NavLink>
                <NavLink to="/services">
                    {(link) => <HandCoins color="#223042" fill={link.isActive ? "#7391B7" : "#FFF"} />}
                </NavLink>
                <NavLink to="/profile">
                    {(link) => <UserRound color="#223042" fill={link.isActive ? "#7391B7" : "#FFF"} />}
                </NavLink>
            </div>
        </div>
    )
}