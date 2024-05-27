import { useState } from "react";

export const useLocalStorage = <T>(keyValue: string, defaultValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(()=>{
        try{
            const value = localStorage.getItem(keyValue);
            if(value){
                return JSON.parse(value);
            }
            localStorage.setItem(keyValue, JSON.stringify(defaultValue));
            return defaultValue;
        }catch(error){
            return defaultValue;
        }
    });

    const setValue = (newValue: T) => {
        try{
            localStorage.setItem(keyValue, JSON.stringify(newValue));
            setStoredValue(newValue);
        }catch(error){
            setStoredValue(newValue);
        }
    }

    return [storedValue, setValue];
}