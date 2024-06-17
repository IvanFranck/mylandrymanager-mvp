import {Card} from "@tremor/react"
export function HomeView() {
    return (
        <div className="px-5">
            <Card className="mx-auto max-w-md">      
                <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">        
                    Sales      
                </h4>      
                <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">        
                    $71,465      
                </p>    
            </Card>
        </div>
    )
}