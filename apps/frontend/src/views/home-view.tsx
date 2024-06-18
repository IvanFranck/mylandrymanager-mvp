import { BadgePercent, BarChart2, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

export const HomeView = () => {
  return (
    <div className='px-3'>
      <h2 className="text-3xl font-semibold">Bienvenue</h2>
      <p className="font-light text-gray-600 text-sm">Dev Pressing !</p>

      {/** stats blocks */}
      <section className="w-full mt-4 grid grid-cols-2 grid-rows-2 gap-3">
        <div className="rounded-2xl row-span-2 bg-green-100/50 shadow-xl shadow-[#84BEBD]/25 grid place-items-center py-8">
            <BarChart2 size={150} strokeWidth={3} color="#84BEBD"/>
            <h5 className="text-xl font-semibold mt-4">Activité</h5>
            <p className="font-light text-gray-500 text-sm">de la semaine</p>
        </div>

        <div className="rounded-2xl bg-orange-100/50 shadow-xl shadow-[#68440A]/10 flex flex-col items-start justify-between px-4 py-6 gap-3">
          <BadgePercent color="#CF8815"/>
          <div>
            <h5 className="text-xs font text-gray-500">Ventes de la semaine</h5>
            <span className="text-xl font-semibold">25,000 fcfa</span>
          </div>
        </div>

        <Link to="deliveries">
          <div className="rounded-2xl bg-purple-100/50 shadow-xl shadow-[#403BB7]/15 flex flex-col items-start justify-between px-4 py-6 gap-3">
            <CalendarClock color="#4338ca"/>
            <div>
              <h5 className="text-xs font text-gray-500">Commandes à livrer cette semaine</h5>
              <span className="text-xl font-semibold">5</span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}