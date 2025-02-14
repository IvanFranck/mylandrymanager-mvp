import { Loader, PackageCheck } from "lucide-react";
import DeliveriesOverview from "./home/deliveries-overview";
import { WeekIncomesView } from "./home/week-incomes";

export const HomeView = () => {
  return (
    <div className='px-3'>
      <h2 className="text-gray-600 text-sm font-light">Salut</h2>
      <p className="text-2xl font-semibold">Ivan !</p>

      <section className="w-full mt-4">
        <div className="w-full flex">
          <div className="w-1/2 pr-2">
            <div className="w-full bg-[#FF6968] p-4 rounded-md shadow-lg shadow-[#ff827e9e] relative overflow-hidden">
              <span className="bg-[#FF827E] p-6 rounded-full w-max block absolute -top-2 -right-2">
                <Loader size={16} className="text-white" />
              </span>
              <div className="mr-4">
                <h3 className="leading-tight  text-white/80 font-light mb-1">Commandes en attente</h3> 
                <p className="text-md font-semibold text-white">03</p>
              </div>
            </div>
          </div>

          <div className="w-1/2 pr-2">
            <div className="w-full bg-[#2AC3FF] p-4 rounded-md shadow-lg shadow-[#40d6ff86] relative overflow-hidden">
              <span className="bg-[#40D7FF] p-6 rounded-full w-max block absolute -top-2 -right-2">
                <PackageCheck size={16} className="text-white" />
              </span>
              <div className="mr-8">
                <h3 className="leading-tight  text-white/80 font-light mb-1">Commandes prêtes</h3> 
                <p className="text-md font-semibold text-white">00</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 pl-1"></div>
      </section>

      {/** stats blocks */}
      <section className="w-full mt-6 flex flex-col gap-3">
        <WeekIncomesView/>
        <DeliveriesOverview/>
      </section>
    </div>
  );
}