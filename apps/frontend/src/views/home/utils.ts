import { IncomesStatsEntity } from "@/lib/types/entities";
import { addDays, endOfWeek, format, nextDay, previousDay, startOfWeek } from "date-fns";

export type IncomesChartDataType = {
    date: string,
    Sales: number
}

export type PaginationLinksType = {
    prev: string,
    next: string
}
  

export const getCurrentWeekData = (apiData: IncomesStatsEntity[]): IncomesChartDataType[] => {
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

export function getPaginationNextLink(date: string) {
    const nextMonday = nextDay(new Date(date), 1);
    const queryParams = {
        from: startOfWeek(nextMonday, { weekStartsOn: 1 }).toISOString(),
        to: endOfWeek(nextMonday, { weekStartsOn: 1 }).toISOString(),
    };
    return queryParams
}

export function getPaginationPrevLink(date: string) {
    const prevMonday = previousDay(new Date(date), 1);
    const queryParams = {
        from: startOfWeek(prevMonday, { weekStartsOn: 1 }).toISOString(),
        to: endOfWeek(prevMonday, { weekStartsOn: 1 }).toISOString(),
    };
    return queryParams;
}


export const dataFormatter = (number: number) =>
`${Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(number).toString()}`;

