import { useMatches, Params } from "react-router-dom";

interface RouteHandler {
    pageTitle?: (params: Params<string>) => string
}

export function PagetitleLayout() {
    const titles = useMatches()
    .reduce<string[]>((acc, match) => {
        const route  = match.handle as RouteHandler
        if (route?.pageTitle) {
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
