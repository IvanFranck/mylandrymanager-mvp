import { AreaChart } from '@tremor/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { startOfWeek, endOfWeek } from 'date-fns'; // Ajout de date-fns
import { useGetIncomes } from '@/lib/hooks/use-cases/incomes/useGetIncomes';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { dataFormatter, getCurrentWeekData, getPaginationNextLink, getPaginationPrevLink, IncomesChartDataType } from './utils';




export function WeekIncomesView() {
  const [chartData, setChartData] = useState<IncomesChartDataType[]>()
  const [filters, setFilters] = useState<{from: string, to: string}>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString()
  })
  const {data: incomesData, isFecthing} = useGetIncomes({
    filters: {
      from: filters.from,
      to: filters.to
    }
  })
  
  const totalSales = chartData ? chartData.reduce((acc, cur) => acc + cur.Sales, 0) : 0;

  function getNextIncomes(){
    const {from, to} = getPaginationNextLink(filters.from);
    setFilters({from, to})
  }

  function getPrevIncomes(){
    const {from, to} = getPaginationPrevLink(filters.from);
    setFilters({from, to})
  }

  
  useEffect(()=>{
    if(incomesData){
      setChartData(getCurrentWeekData(incomesData.details))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomesData])


  return (
    <div>
      {
        isFecthing ? <Skeleton className='w-full h-60'/>  : (
          <>
            <div className='w-full flex justify-between items-start'>
              <div>
                <h3 className="text-2xl">Revenus de la semaine</h3>
                <p className='text-gray-400 font-extralight'>Juillet 14 - 20 </p>
                <p className='text-xl font-semibold'>{dataFormatter(totalSales)}</p>
                <div className='mt-2 flex items-center gap-3'>
                  <a onClick={getPrevIncomes} className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'>
                    <ArrowLeft className='text-gray-400' size={16} />
                  </a>
                  <a onClick={getNextIncomes} className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'>
                    <ArrowRight className='text-gray-400' size={16} />
                  </a>
                </div>
              </div>
            </div>
            <div>
                <AreaChart
                  className="h-60"
                  data={chartData || []}
                  index="date"
                  showLegend={false}
                  categories={['Sales']}
                  colors={['blue']}
                  valueFormatter={dataFormatter}
                  onValueChange={(v) => console.log(v)}
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

type IncomesHeaderProps = {
  chartData: IncomesChartDataType[]
}

const IncomesHeader = ({chartData}: IncomesHeaderProps) => {

  const [filters, setFilters] = useState<{from: string, to: string}>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString()
  })

  
  const totalSales = chartData ? chartData.reduce((acc, cur) => acc + cur.Sales, 0) : 0;

  function getNextIncomes(){
    const {from, to} = getPaginationNextLink(filters.from);
    setFilters({from, to})
  }

  function getPrevIncomes(){
    const {from, to} = getPaginationPrevLink(filters.from);
    setFilters({from, to})
  }

  return(
    <div className='w-full flex justify-between items-start'>
      <div>
        <h3 className="text-2xl">Revenus de la semaine</h3>
        <p className='text-gray-400 font-extralight'>Juillet 14 - 20 </p>
        <p className='text-xl font-semibold'>{dataFormatter(totalSales)}</p>
        <div className='mt-2 flex items-center gap-3'>
          <a onClick={getPrevIncomes} className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'>
            <ArrowLeft className='text-gray-400' size={16} />
          </a>
          <a onClick={getNextIncomes} className='w-6 h-6 rounded-full border-2 border-gray-400 grid place-content-center'>
            <ArrowRight className='text-gray-400' size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}

