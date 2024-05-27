import { Link } from "react-router-dom";

export default function Registerview() {
    return(
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="flex flex-col px-3">
                <h1 className="text-4xl font-medium">Créer un compte.</h1>
                <div className="mt-8">
                    <p className="text-center">Form</p>                    
                    <p className="text-sm text-center mt-4">Vous avez déja pas de compte ? <Link className="text-blue-500" to="/">Connectez vous!</Link></p>
                </div>
            </div>
        </div>
    )
}