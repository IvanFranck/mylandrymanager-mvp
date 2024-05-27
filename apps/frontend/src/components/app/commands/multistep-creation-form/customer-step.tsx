import { CUSTOMERS_QUERY_KEY } from "@/common/constants/query-keys";
import { Input } from "@/components/ui/input";
import { fetchAllCustomersQuery, searchCustomerByName } from "@/lib/api/customers";
import { useQuery } from "@tanstack/react-query";
import CustomerListItem from "../../customers/customer-list-item";
import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash"
import { CustomersEntity } from "@/lib/types/entities";
import { NoDataIllustration } from "@/components/illustrations/no-data-illustration";
import CustomerCreationDrawer from "../../customers/customer-creation-drawer";
import SearchSkeleton from "../../search-skeleton";

type CusrtomerStepProps = {
    selectedCustomer: CustomersEntity | undefined
    setSelectedCustomer: React.Dispatch<React.SetStateAction<CustomersEntity | undefined>>
}

export function CustomerStep({ selectedCustomer, setSelectedCustomer }: CusrtomerStepProps) {

    const [findedCustomers, setFindedCustomers] = useState<CustomersEntity[] | undefined>();
    const [searchloading, setSearchLoading] = useState(false)

    const { data: customers } = useQuery({
        queryKey: CUSTOMERS_QUERY_KEY,
        queryFn: fetchAllCustomersQuery,
        staleTime: 12000
    })


    const handleSearch = useCallback(async (searchText: string) => {
        if (!searchText) {
            setFindedCustomers(undefined)
            setSearchLoading(false)
            return
        }
        try {
            const result = await searchCustomerByName(searchText.trim())
            setFindedCustomers(result.details)
        } catch (error) {
            console.error('catched error', error)
        } finally {
            setSearchLoading(false)
        }
    }, [])

    const debounceSearch = useMemo(() => {
        return debounce(handleSearch, 1000);
    }, [handleSearch])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchLoading(true)
        await debounceSearch(e.target.value)
    }

    return (

        <div className="w-full mt-4 flex flex-col">
            <h3 className="text-lg font-medium">Client</h3>

            {
                selectedCustomer ? (
                    <div className="w-full mt-4 flex flex-row justify-between items-center">
                        <CustomerListItem customer={selectedCustomer} className=" border-0 px-0" selected />
                        <h3
                            className="text-blue-700 cursor-pointer font-semibold mb-2"
                            onClick={() => { setSelectedCustomer(undefined); setFindedCustomers(undefined) }}
                        >
                            Changer
                        </h3>
                    </div>
                ) :
                    <>
                        {/* search and new */}
                        <div className="w-full flex items-center space-x-2 mt-4">
                            <Input onChange={handleChange} className="bg-white" type="search" placeholder="Rechercher un client par son nom" />
                            <CustomerCreationDrawer onCustomerCreated={setSelectedCustomer} />
                        </div>

                        {/* customers list */}
                        <div className="w-full grid mt-6">

                            {/* customers list */}
                            {
                                searchloading ?
                                    <SearchSkeleton length={3} />
                                    : findedCustomers ? findedCustomers.length === 0 ? <NoDataIllustration text="Aucun client correspondant" /> :
                                        findedCustomers.map((customer) => <CustomerListItem onClick={() => setSelectedCustomer(customer)} key={customer.id} customer={customer} className=" border-x-0 border-t-0 border-b-slate-300" />)
                                        : customers ?
                                            customers.details.map((customer) => <CustomerListItem onClick={() => setSelectedCustomer(customer)} key={customer.id} customer={customer} className=" border-x-0 border-t-0 border-b-slate-300" />)
                                            : <SearchSkeleton length={3} />
                            }
                        </div>
                    </>
            }

        </div>
    )
}