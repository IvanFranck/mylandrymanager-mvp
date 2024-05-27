import { HandCoins, Home, ReceiptText, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileNavLayout() {

    return (
        <div className="absolute bottom-0 py-3 w-full bg-white">
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