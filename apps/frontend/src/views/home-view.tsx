import DeliveriesOverview from "./home/deliveries-overview";
import { WeekIncomesView } from "./home/week-incomes";

export const HomeView = () => {
  return (
    <div className='px-3'>
      <h2 className="text-3xl font-semibold">Bienvenue</h2>
      <p className="font-light text-gray-600 text-sm">Dev Pressing !</p>

      {/** stats blocks */}
      <section className="w-full mt-6 flex flex-col gap-3">
        <WeekIncomesView/>
        <DeliveriesOverview/>
      </section>
    </div>
  );
}