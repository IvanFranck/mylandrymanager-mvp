import { useRouteError } from "react-router-dom"

type RouteErrorType = {
    statusText: string,
    message: string
}

export default function ErrorPage() {
    const error: RouteErrorType = useRouteError() as RouteErrorType
    console.error(error)

    return (
        <div className="container">
            <div className="flex flex-col space-y-3">
                <h2>Oops!</h2>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            </div>
        </div>
    )
}