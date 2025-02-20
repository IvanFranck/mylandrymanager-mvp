import { useMatches } from "react-router-dom";

<<<<<<< HEAD
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
=======
export function PagetitleLayout() {
    const titles = useMatches()
        .reduce((acc, match) => {
            if (match.handle?.pageTitle) {
                acc.push(match.handle.pageTitle(match.params));
            }
            return acc;
        }, []);
>>>>>>> feature/home-ui-refactor

    return (
        titles && <div className="w-full px-4 py-3">
            {titles.map((title, index) => (
                <div key={index}>{title}</div>
            ))}
        </div>
    );
}
