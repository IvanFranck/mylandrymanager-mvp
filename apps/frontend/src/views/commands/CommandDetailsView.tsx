import ServiceOnCommandListItem, { ServiceOnCommandListItemProps } from "@/components/app/commands/ServiceOnCommandListItem"

export const CommandDetailView = () => {
    const services: ServiceOnCommandListItemProps[] = [
        {
            serviceName: "Chemises blanches",
            quantity: 2,
            price: "750 Fcfa"
        },
        {
            serviceName: "Autres chemises",
            quantity: 5,
            price: "1050 Fcfa"
        },
        {
            serviceName: "Veste",
            quantity: 1,
            price: "3000 Fcfa"
        }
    ]
    return (
        <div className="w-full flex flex-col space-y-3">
            <div className="w-full flex flex-col items-start px-2 py-3">
                <h2 className="text-3xl font-bold text-green-600 mb-2"> 3050 Fcfa </h2>
                <p className="">Client: <span className="ml-2">John Doe</span></p>
                <p className="text-blue-700">En cours</p>
                <p className="text-gray-500 font-light text-sm">Oct 21, 2023</p>
            </div>

            <div className="w-full flex flex-col space-y-2 px-2">
                {services.map(({ price, quantity, serviceName }) => (
                    <ServiceOnCommandListItem key={serviceName} price={price} quantity={quantity} serviceName={serviceName} />
                ))}
            </div>
        </div>
    )
}