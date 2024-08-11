import { AreaChart } from '@tremor/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { startOfWeek, format, addDays, endOfWeek } from 'date-fns'; // Ajout de date-fns
import { IncomesStatsEntity } from '@/lib/types/entities';
import { useGetIncomes } from '@/lib/hooks/use-cases/incomes/useGetIncomes';
import { useEffect, useState } from 'react';

type IncomesChartDataType = {
  date: string,
  Sales: number
}


const getCurrentWeekData = (apiData: IncomesStatsEntity[]): IncomesChartDataType[] => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekData = Array.from({ length: 7 }, (_, index) => {
    const date = format(addDays(startDate, index), 'dd/MM/yyyy'); // Formatage de la date
    const incomesData = apiData.find(item => item.day === date); // Correspondance avec les données de l'API
    return {
      date: format(addDays(startDate, index), 'E dd'), // Formatage pour l'affichage
      Sales: incomesData ? incomesData.amount : 0, // Utilisation de amount ou 0 si pas de correspondance
    };
  });
  return weekData;
};


const dataFormatter = (number: number) =>
  `${Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(number).toString()}`;



export function WeekIncomesView() {
  const [chartData, setChartData] = useState<IncomesChartDataType[]>()
  const {incomes, isFecthing} = useGetIncomes({
    filters: {
      from: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString()
    }
  })
  const totalSales = chartData ? chartData.reduce((acc, cur) => acc + cur.Sales, 0) : 0;

  useEffect(()=>{
    if(incomes){
      setChartData(getCurrentWeekData(incomes))
    }
  }, [incomes])

  return (
    <div>
      {
        isFecthing && !chartData ?  <span>loading...</span> : (
          <>
            <div className='w-full flex justify-between items-start'>
              <div>
                
                <h3 className="text-2xl">Revenus de la semaine</h3>
                <p className='text-gray-400 font-extralight'>Juillet 14 - 20 </p>
                <p className='text-xl font-semibold'>{dataFormatter(totalSales)}</p>
                <div className='mt-2 flex items-center gap-3'>
                  <span className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'><ArrowLeft className='text-gray-400' size={16} /></span>
                  <span className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'><ArrowRight className='text-gray-400' size={16} /></span>
                </div>
              </div>
            </div>
            <div>
                <AreaChart
                  className="h-60"
                  data={chartData}
                  index="date"
                  showLegend={false}
                  categories={['Sales']}
                  colors={['blue']}
                  valueFormatter={dataFormatter}
                  onValueChange={(v) => console.log(v)}
                  showYAxis={false}
                  showGradient={false}
                  showGridLines={true}
                />
            </div>
          </>
        )
      }
    </div>
  );
}

