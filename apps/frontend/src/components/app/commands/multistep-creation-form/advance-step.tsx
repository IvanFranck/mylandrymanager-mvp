import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GenericForm } from "@/components/ui/generic-form";
import { X } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";
import z from "zod";

export type AdvanceStepProps = {
    setAdvance: Dispatch<React.SetStateAction<number>>;
    advance: number;
    billingPrice: number
    discount: number
};

export default function AdvanceStep({ setAdvance, advance, billingPrice, discount }: AdvanceStepProps) {
    const [inputAdvance, setInputAdvance] = useState(0);
    const [showInput, setShowInput] = useState(false)

    const AdvanceFormSchema = z.object({
        advance: z.string()
            .trim()
            .min(0)
            .max(billingPrice, "le montant de l'avance ne doit pas être supérieur au montant de la facture!")
            .transform(value => parseFloat(value))
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputAdvance(parseFloat(e.target.value));
    };

    const onSubmit = (values: z.infer<typeof AdvanceFormSchema>) => {
        setAdvance(values.advance);
    };

    const deleteAdvance = () =>{
        setAdvance(0)
        setInputAdvance(0)
    }

    const handleClick = () => {
        if (Boolean(advance) && showInput) return
        setShowInput(!showInput)
    }

    useEffect(()=>{
        if (!showInput){
            setAdvance(billingPrice-discount);
        }else{
            setAdvance(0)
        }
    }, [billingPrice, discount, setAdvance, showInput])


    return (
        <section className="w-full space-y-4 p-2">
             <div className="items-top flex space-x-2"  >
                <Checkbox checked={!showInput}  onClick={handleClick} id="advancebtn"/>
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="advancebtn"
                        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Le client a réglé totalement sa facture d'avance.
                    </label>
                    <p className={`text-sm text-muted-foreground ${showInput? 'block' : 'hidden'}`}>
                        Montant avancé
                    </p>
                </div>
            </div>
        
            {
                showInput && (
                    <div className="w-full flex flex-col space-y-2">
                        {
                            advance > 0
                            ? <div className="w-full flex justify-between items-center">
                                <p className="text-green-500 text-lg font-medium"> {advance} fcfa</p>
                                <Button variant='link' className="text-lg font-medium hover:underline-offset-1 hover:underline text-red-600" onClick={deleteAdvance}>
                                    <X size={24} />
                                </Button>
                            </div>
                            :   <GenericForm
                                    schema={AdvanceFormSchema}
                                    defaultValues={{ advance: 0 }}
                                    onSubmit={onSubmit}
                                    fields={[
                                        {
                                            name: "advance",
                                            type: "number",
                                            onFieldChange: handleChange,
                                            inputStyle: 'grow bg-inherit',
                                        }
                                    ]}
                                    submitButton={
                                        <Button
                                            type="submit"
                                            disabled={inputAdvance <= 0}
                                            className="bg-blue-500 py-5 mt-2 w-full"
                                        >
                                            Enregistrer l'avance
                                        </Button>
                                    }
                                />  
                        }
                    </div>
                )
            }
        </section>
    );
}
