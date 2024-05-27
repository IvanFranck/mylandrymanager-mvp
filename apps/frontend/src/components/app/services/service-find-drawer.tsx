import { SERVICES_QUERY_KEY } from "@/common/constants/query-keys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAllServicesQuery, searchServiceByName } from "@/lib/api/services";
import { ServiceOnCommandEntity, ServicesEntity } from "@/lib/types/entities";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration";
import { ServiceListItem } from "./service-list-item";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, SquarePen, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"
import SearchSkeleton from "../search-skeleton";
import { DrawerContent, Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

type ServiceFindDrawerProps = {
    selectedServices: ServiceOnCommandEntity[] | []
    setSelectedServices: React.Dispatch<React.SetStateAction<ServiceOnCommandEntity[] | []>>
}
export default function ServiceFindDrawer({ selectedServices, setSelectedServices }: ServiceFindDrawerProps) {
    const [searchloading, setSearchLoading] = useState(false)
    const [findedServices, setFindedServices] = useState<ServicesEntity[] | undefined>();
    const [isOpen, setOpen] = useState(false)

    const { data: services } = useQuery({
        queryKey: SERVICES_QUERY_KEY,
        queryFn: fetchAllServicesQuery,
        staleTime: 12000
    })

    const handleSearch = useCallback(async (searchText: string) => {
        if (!searchText) {
            setFindedServices(undefined)
            setSearchLoading(false)
            return
        }
        try {
            const result = await searchServiceByName(searchText.trim())
            setFindedServices(result)
        } catch (error) {
            console.error('catched error', error)
        } finally {
            setSearchLoading(false)
        }
    }, [])

    const handleSelectService = (quantity: number, service: ServicesEntity) => {
        if (selectedServices.find((item) => item.service.id === service.id)) {
            const tabs = selectedServices.map((item) => {
                if (item.service.id === service.id) {
                    return { ...item, quantity }
                }
                return item
            })
            setSelectedServices(tabs)
            return
        }
        setSelectedServices([...selectedServices, { service, quantity }])
    }

    const unselectService = (index: number) => {
        setSelectedServices(selectedServices.filter((_, i) => i !== index))
    }

    const debounceSearch = useMemo(() => {
        return debounce(handleSearch, 1000)
    }, [handleSearch])

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchLoading(true)
        await debounceSearch(e.target.value)
    }


    return (
        <div className={`${selectedServices.length > 0 ? 'grow-0' : 'grow'}`}>
            <div className="w-full">
                {
                    selectedServices.length > 0
                        ? <SquarePen size={24} onClick={() => setOpen(true)} className="text-blue-600 cursor-pointer" />
                        : <Input onClick={() => setOpen(true)} className="bg-inherit" type="search" placeholder="Rechercher un service" />

                }
            </div>
            <AnimatePresence>
                {
                    isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 600 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 600 }}
                            transition={{ duration: 0.3 }}
                            className="fixed z-20 top-0 left-0 right-0 h-full bg-white"
                        >
                            <div className="mx-auto h-auto w-full px-4 mt-10 mb-10 space-y-6">
                                <div className="w-full flex flex-row justify-between items-center space-x-2">
                                    <Input onChange={handleChange} className="bg-inherit grow" type="search" placeholder="Rechercher un service" />
                                    {/* modal close btn */}
                                    <div className="grow-0">
                                        <Button variant='ghost' onClick={() => setOpen(false)}>
                                            <span className="text-blue-600">Terminer</span>
                                        </Button>
                                    </div>
                                </div>
                                {
                                    (selectedServices && selectedServices.length > 0) && (
                                        <div className="w-full flex flex-col space-y-2">
                                            <h5 className="text-sm font-semibold text-gray-500">Services choisis</h5>
                                            <div className="w-full flex flex-row flex-wrap">
                                                {selectedServices.map(({ service, quantity }, index) => (
                                                    <ServiceOnCommandDrawer
                                                        key={service.id}
                                                        service={service}
                                                        onQuantityChange={handleSelectService}
                                                        qty={quantity}
                                                    >
                                                        <Badge variant='secondary' className="flex justify-center items-center space-x-2 mb-2 mr-2 ">
                                                            <span>{service.label} ({quantity})</span>
                                                            <X onClick={() => unselectService(index)} strokeWidth={4} size={12} className="text-gray-500 cursor-pointer" />
                                                        </Badge>
                                                    </ServiceOnCommandDrawer>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="w-full">

                                    {
                                        searchloading ?
                                            <SearchSkeleton length={4} />
                                            : findedServices ? findedServices.length === 0 ? <NoDataIllustration text="Aucun service trouvé" /> :
                                                findedServices.map((service) => {
                                                    return (
                                                        <ServiceOnCommandDrawer
                                                            key={service.id}
                                                            disbaled={Boolean(selectedServices.find((selectedService) => selectedService.service.id === service.id))}
                                                            service={service}
                                                            onQuantityChange={handleSelectService}
                                                            className="w-full"
                                                        >
                                                            <ServiceListItem className="border-x-0 border-t-0 border-b-slate-300 cursor-pointer" service={service} simple />
                                                        </ServiceOnCommandDrawer>
                                                    )
                                                })
                                                : services ?
                                                    services.map((service) => {
                                                        return (
                                                            <ServiceOnCommandDrawer
                                                                key={service.id}
                                                                disbaled={Boolean(selectedServices.find((selectedService) => selectedService.service.id === service.id))}
                                                                service={service}
                                                                onQuantityChange={handleSelectService}
                                                                className="w-full"
                                                            >
                                                                <ServiceListItem className="border-x-0 border-t-0 border-b-slate-300 cursor-pointer" service={service} simple />
                                                            </ServiceOnCommandDrawer>
                                                        )
                                                    })
                                                    : <SearchSkeleton length={4} />
                                    }
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    )
}

type ServiceOnCommandDrawerProps = {
    service: ServicesEntity,
    children: ReactNode
    onQuantityChange: (quantity: number, service: ServicesEntity) => void
    disbaled?: boolean
    qty?: number
}

const ServiceOnCommandDrawer = ({ service, children, onQuantityChange, disbaled = false, qty = 0, ...props }: ServiceOnCommandDrawerProps & React.HTMLProps<HTMLDivElement>) => {
    const [quantity, setQuantity] = useState<number>(qty)
    const drawerCloserBtn = useRef(null)

    useEffect(() => {
        setQuantity(qty)
    }, [qty])

    const handleClick = () => {
        onQuantityChange(quantity, service)
        drawerCloserBtn.current.click()
    }

    const handleClose = () => {
        if (!qty) setQuantity(0)
    }
    return (
        <Drawer onClose={handleClose}>
            <DrawerTrigger disabled={disbaled} className={`${props.className} text-start ${disbaled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {children}
            </DrawerTrigger>

            <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/[0.5]" />
                <DrawerContent>
                    <div className="mx-auto w-full space-y-6 px-4 mt-4 mb-10">
                        <DrawerTitle className="text-center font-normal leading-8">
                            Définissez la quantité pour le service
                            <br />" <i className="font-medium">{service.label}</i> "
                        </DrawerTitle>
                        <div className="w-full flex flex-row justify-evenly items-center">
                            <Button variant='secondary' disabled={quantity <= 0} onClick={() => setQuantity(quantity - 1)}>
                                <Minus />
                            </Button>
                            <span className="text-4xl font-extrabold">{quantity}</span>
                            <Button variant='secondary' onClick={() => setQuantity(quantity + 1)}>
                                <Plus />
                            </Button>
                        </div>
                        <DrawerFooter>
                            <Button disabled={quantity <= 0} onClick={handleClick} className="bg-blue-600 text-white">
                                Valider
                            </Button>
                            <DrawerClose ref={drawerCloserBtn} asChild>
                                <Button variant='outline' className="text-blue-600">
                                    Annuler
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </DrawerPortal>
        </Drawer>
    )
}
