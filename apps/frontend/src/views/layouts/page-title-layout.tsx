import { useMatches, Params } from "react-router-dom";

interface RouteHandle {
    pageTitle?: (params: Params) => string;
}
export function PagetitleLayout() {
    const titles = useMatches()
        .reduce<string[]>((acc, match) => {
            const route  = match.handle as RouteHandle
            if (route.pageTitle) {
                acc.push(route.pageTitle(match.params));
            }
            return acc;
        }, []);

    return (
        titles && <div className="w-full px-4 py-3">
            {titles.map((title, index) => (
                <div key={index}>{title}</div>
            ))}
        </div>
    );
}
