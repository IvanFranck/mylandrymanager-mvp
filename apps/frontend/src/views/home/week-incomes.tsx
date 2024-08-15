import { AreaChart } from '@tremor/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { dataFormatter, getCurrentWeekData, IncomesChartDataType } from './utils';
import { getIncomesStats } from '@/lib/api/incomes';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { TGenericAxiosError } from '@/lib/types/responses';
import { fr } from 'date-fns/locale';

export function WeekIncomesView() {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<IncomesChartDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchIncomes = useCallback(async () => {
    setIsLoading(true);
    try {
      const from = currentWeekStart.toISOString();
      const to = endOfWeek(currentWeekStart).toISOString();
      const results = await getIncomesStats({ from, to });
      setChartData(getCurrentWeekData(results.details, currentWeekStart));
    } catch (error) {
      const message = (error as AxiosError<TGenericAxiosError>).response?.data?.message || 'Impossible de récupérer les entrées pour la période sélectionnée';
      toast({
        variant: "destructive",
        description: message,
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart, toast]);

  const totalSales = useMemo(() => {
    return chartData.reduce((acc, cur) => acc + cur.Sales, 0);
  }, [chartData]);

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const goToPrevWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };

  useEffect(() => {
    fetchIncomes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeekStart]);


  return (
    <div>
      {isLoading ? <Skeleton className='w-full h-60' /> : (
        <>
          <div className='w-full flex justify-between items-start'>
            <div className='w-full'>
              <h3 className="text-2xl">Revenus de la semaine</h3>
              <p className='text-xl font-semibold'>{dataFormatter(totalSales)}</p>
              <div className='flex justify-between w-full items-center mt-2'>
                <p className='text-gray-400 font-light'>{`${format(currentWeekStart, 'E dd', {locale: fr})} - ${format(endOfWeek(currentWeekStart, {weekStartsOn: 1}), 'dd')}`}</p>
                <div className='mt-2 flex items-center gap-3'>
                  <a onClick={goToPrevWeek} className=''>
                    <ChevronLeft className='text-gray-400' size={24} />
                  </a>
                  <a onClick={goToNextWeek} className=''>
                    <ChevronRight className='text-gray-400' size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <AreaChart
              className="h-60"
              data={chartData}
              index="date"
              showLegend={false}
              categories={['Sales']}
              colors={['blue']}
              showGradient={false}
              showGridLines={true}
            />
          </div>
        </>
      )}
    </div>
  );
}