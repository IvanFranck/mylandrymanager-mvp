import { AreaChart } from '@tremor/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const chartdata = [
  {
    date: 'Lun 15',
    Sales: 2890,
  },
  {
    date: 'Mar 16',
    Sales: 2756,
  },
  {
    date: 'Mer 17',
    Sales: 3322,
  },
  {
    date: 'Jeu 18',
    Sales: 3470,
  },
  {
    date: 'Ven 19',
    Sales: 3475,
  },
  {
    date: 'Sam 20',
    Sales: 3129,
  },
  {
    date: 'Dim 21',
    Sales: 3490,
  },
 
];

const dataFormatter = (number: number) =>
  `${Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(number).toString()}`;

const totalSales = chartdata.reduce((acc, cur) => acc + cur.Sales, 0);

export function WeekIncomesView() {
  return (
    <>
      <div className='w-full px-4 flex justify-between items-start'>
        <div className='w-1/2'>
          <h3 className="text-gray-400 font-extralight">Revenus de la semaine Juillet 14 - 20 </h3>
          <p className='text-2xl font-bold'>{dataFormatter(totalSales)}</p>
          <div className='mt-2 flex items-center gap-3'>
            <span className='w-8 h-8 rounded-full border-2 border-gray-400 grid place-content-center'><ArrowLeft className='text-gray-400' size={20} /></span>
            <span className='w-8 h-8 rounded-full border-2 border-gray-400 grid place-content-center'><ArrowRight className='text-gray-400' size={20} /></span>

          </div>
        </div>
      </div>
      <div className='px-1'>
          <AreaChart
            className="h-60"
            data={chartdata}
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
  );
}

