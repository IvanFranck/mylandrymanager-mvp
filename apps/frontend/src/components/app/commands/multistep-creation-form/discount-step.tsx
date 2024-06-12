import { Button } from "@/components/ui/button";
import { GenericForm } from "@/components/ui/generic-form";
import { X } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";
import z from "zod"
export type DiscountStepProps = {
    setDiscount: Dispatch<React.SetStateAction<number>>
    discount: number
    billingPrice: number
}


export default function DiscountStep({ setDiscount, billingPrice, discount }: DiscountStepProps) {
    const [discountPercentage, setDiscountPercentage] = useState(0)
    const [showDiscount, setShowDiscount] = useState(false)
    const [inputDiscount, setInputDiscount] = useState(0)

    const DiscountFormSchema = z.object({
        discount: z.string()
            .trim()
            .min(0)
            .max(billingPrice, 'La valeur de la réduction ne doit pas être supérieure au montant de la facture !')
            .transform(value => parseFloat(value))
    })

    useEffect(() => {
        const percentageReduction = (inputDiscount / billingPrice) * 100;
        const roundedPercentage = Math.round(percentageReduction * 100) / 100;
        setDiscountPercentage(roundedPercentage)
    }, [inputDiscount, billingPrice])

    useEffect(() => {
        if (showDiscount === false) {
            setDiscount(0)
            setInputDiscount(0)
        }
    }, [showDiscount, setDiscount])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputDiscount(parseFloat(e.target.value))
    }

    const onSubmit = (values: z.infer<typeof DiscountFormSchema>) => {
        setDiscount(values.discount)
    }

    const handleClick = () => {
        if (Boolean(discount) && showDiscount) return
        setShowDiscount(!showDiscount)
    }

    return (
        <section className={`w-full space-y-4 p-2 rounded-lg ${showDiscount ? 'bg-blue-50' : ''}`}>
            <Button disabled={Boolean(discount) && showDiscount} onClick={handleClick} variant='link' className="p-0 text-lg font-medium hover:underline-offset-1 hover:underline text-blue-600">Ajouter une réduction ?</Button>
            {
                showDiscount && (
                    <div className="w-full flex flex-col space-y-2">
                        {
                            discount > 0
                                ? <div className="w-full flex justify-between items-center">
                                    <p className="text-gray-500 text-md"> - {discount} fcfa</p>
                                    <Button variant='link' className="text-lg font-medium hover:underline-offset-1 hover:underline text-red-600" onClick={() => setShowDiscount(false)}><X size={24} /></Button>
                                </div>
                                : (
                                    <GenericForm
                                        schema={DiscountFormSchema}
                                        defaultValues={{discount: 0}}
                                        onSubmit={onSubmit}
                                        fields={[
                                            {
                                                name: "discount", 
                                                type: "number", 
                                                onFieldChange:handleChange, 
                                                inputStyle: 'grow bg-inherit', 
                                                errorMessage: "La valeur de la réduction ne doit pas être supérieure au montant de la facture !"
                                            }
                                        ]}
                                        submitButton={
                                            <Button
                                                type="submit"
                                                disabled={inputDiscount <= 0}
                                                className="bg-blue-500 py-5 mt-2 w-full"
                                            >
                                                Appliquer {0 < inputDiscount && discountPercentage <= 100 && <strong className="ml-1">(-{discountPercentage}%)</strong>}
                                            </Button>
                                        }
                                    />
                                )
                        }
                    </div>
                )
            }
        </section>
    )
}
