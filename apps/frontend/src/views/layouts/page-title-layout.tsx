import { useMatches } from "react-router-dom";

export function PagetitleLayout() {
    const titles = useMatches()
        .reduce((acc, match) => {
            if (match.handle?.pageTitle) {
                acc.push(match.handle.pageTitle(match.params));
            }
            return acc;
        }, []);

    return (
        <div className="w-full px-4 py-3">
            {titles.map((title, index) => (
                <div key={index}>{title}</div>
            ))}
        </div>
    );
}
