import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewCommandButton() {
    const navigate = useNavigate()

    function goToNewCommand() {
        navigate('/commands/create')
    }
    return (
        <Button variant='ghost' className="p-0">
            <Plus className="grow-0 text-blue-600" size={24} onClick={goToNewCommand} />
        </Button>
    )
}