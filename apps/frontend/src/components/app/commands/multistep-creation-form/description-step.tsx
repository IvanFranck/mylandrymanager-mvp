import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { Dispatch } from "react"

type DescriptionStepProps = {
    description: string,
    setDescription: Dispatch<React.SetStateAction<string>>
}

export default function DescriptionStep({ description, setDescription }: DescriptionStepProps) {
    return (
        <section className="grid w-full gap-1.5">
            <Label className="text-lg font-medium" htmlFor="command-message">Description</Label>
            <p className="text-gray-400 font-light text-sm">Dites en plus sur cette commnde.</p>
            <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="command-message"
                className={`h-32 rounded-md border shadow ${!description && 'text-muted-foreground'}`}
                placeholder="Chemise fleurie, pentalon jeans et t-shirt vert"
            />
        </section>
    )
}