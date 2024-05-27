import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersEntity } from "@/lib/types/entities";
import React from "react";

type CustomerListItemProps = {
    customer: CustomersEntity,
    selected?: boolean,
}

export default function CustomerListItem({ customer, selected = false, ...props }: CustomerListItemProps & React.HTMLProps<HTMLDivElement>) {

    return (
        <Card
            onClick={props.onClick}
            className={`
                bg-inherit rounded-none shadow-none ${props.className}
                ${selected ? "" : "cursor-pointer transition-all duration-300 hover:text-black text-gray-600 hover:shadow-lg"}
            `}
        >
            <CardHeader className="p-2 py-4">
                <CardTitle className={`
                    font-normal  mb-2 
                    ${selected ? "" : "transition-all duration-300 hover:font-medium hover:pl-2"}
                `}>
                    {customer.name}
                </CardTitle>
            </CardHeader>
        </Card>
    )
}