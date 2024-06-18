import { useForm, FieldValues, DefaultValues, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import z from "zod";
import { Input } from "./input";
import { HTMLInputTypeAttribute } from "react";
import { Textarea } from "./textarea";

type FormInputType = HTMLInputTypeAttribute | 'textarea';

type GenericFormProps<T extends FieldValues> = {
    schema: z.ZodSchema<T>;
    defaultValues: DefaultValues<T>;
    onSubmit: ((data: T) => Promise<void>) | ((data: T) => void);
    fields: Array<{ 
        name: Path<T>; 
        label?: string; 
        type?: FormInputType; 
        onFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
        placeholder?: string, 
        errorMessage?: string, 
        labelStyle?: string, 
        inputStyle?: string 
    }>;
    isPending?: boolean;
    submitButton?: React.ReactNode,
    submitLabel?: string,
};

export function GenericForm<T extends FieldValues>({ schema, defaultValues, onSubmit, fields, isPending, submitButton, submitLabel }: GenericFormProps<T>) {
    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col space-y-6">
                    {fields.map(({ name, label, onFieldChange, type = "text", placeholder, errorMessage, labelStyle, inputStyle }) => (
                        <FormField
                            key={String(name)}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    {label && <FormLabel className={labelStyle}>{label}</FormLabel>}
                                    <FormControl onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{
                                        onFieldChange && onFieldChange(e)
                                    }}>
                                        {
                                            type === 'textarea' ?
                                                <Textarea className={inputStyle} placeholder={placeholder} disabled={isPending}  {...field} />
                                                : <Input className={inputStyle} type={type} placeholder={placeholder} disabled={isPending} {...field} />
                                        }
                                        
                                    </FormControl>
                                    {
                                        form.formState.errors[name] && (
                                            <FormDescription className="text-red-500">
                                                { form.formState.errors[name]?.message?.toString() || errorMessage }
                                            </FormDescription>
                                        )
                                    }
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
                {
                    submitButton ?? (
                        <Button disabled={isPending} type="submit">
                            {submitLabel || 'Envoyer'}
                            {isPending && <Loader size={18} className="animate-spin ml-3" />}
                        </Button>
                    )
                }
            </form>
        </Form>
    );
}

