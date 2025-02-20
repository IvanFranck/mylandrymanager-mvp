import { Loader, PackageCheck } from "lucide-react";
import DeliveriesOverview from "./home/deliveries-overview";
import { WeekIncomesView } from "./home/week-incomes";
import KPIBlock from "./home/KPIBlock";

export const HomeView = () => {
  return (
    <div className='px-3'>
      <h2 className="text-gray-600 text-sm font-light">Salut</h2>
      <p className="text-2xl font-semibold">Ivan !</p>

      <section className="w-full mt-4">
        <div className="w-full flex">
          <div className="w-1/2 pr-1">
            <KPIBlock 
              title="Commandes en attente" 
              value={3} 
              Icon={<Loader size={16} className="text-white"/>} 
              wrapperClassName="bg-[#FF6968] shadow-[#ff827e9e]"
              iconClassName="bg-[#FF827E]"
            />
          </div>

          <div className="w-1/2 pl-1">
            <KPIBlock 
              title="Commandes prêtes"
              value={0}
              Icon={<PackageCheck size={16} className="text-white"/>} 
              wrapperClassName="bg-[#2AC3FF] shadow-[#40d6ff86]"
              iconClassName="bg-[#40D7FF]"
            />
          </div>
        </div>
        <div className="w-1/2 pl-1"></div>
      </section>

      {/** stats blocks */}
      <section className="w-full mt-6 flex flex-col gap-6">
        <WeekIncomesView/>
        <DeliveriesOverview/>
      </section>
    </div>
  );
}