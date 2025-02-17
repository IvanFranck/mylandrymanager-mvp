import { useMatches } from "react-router-dom";

interface RouteHandle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageTitle?: (params: any) => never;
}
export function PagetitleLayout() {
    const titles = useMatches()
        .reduce((acc, match) => {
            const pageTitle = (match.handle as RouteHandle)?.pageTitle || undefined;
            if (pageTitle) {
                acc.push(pageTitle(match.params));
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
