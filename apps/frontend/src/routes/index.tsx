import { RouteObject } from "react-router-dom"
import { Root } from "@/views/Root.tsx"
import { CommandsListView } from "@/views/commands/CommandsListView"
import { CommandDetailView } from "@/views/commands/CommandDetailsView"
import ErrorPage from "@/views/error-view"
import PageLayout from "@/views/layouts/page-layout"
import PageTitle from "@/components/app/page-title"
import { HomeView } from "@/views/home-view"
import ServicesListView from "@/views/services/services-list-view"
import { ProfileView } from "@/views/profile-view"
import ServiceEditView from "@/views/services/service-edit-view"
import ServiceCreationDrawer from "@/components/app/services/service-creation-drawer"
import { CommandCreationDrawer } from "@/components/app/commands/command-creation-drawer"
import RegisterView from "@/views/register-view"
import { ProtectedRoute } from "./protected-route"
import { CustomerDetailView } from "@/views/customers/CustomerDetailView"
import { CustomersListView } from "@/views/customers/CustomersListView"
import DeliveriesOverview from "@/views/home/deliveries-overview"


export const routes: RouteObject[] = [
    {
        id: 'Root',
        path: '/',
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Root />
            },
            {
                id: "register",
                path: '/register',
                element: <RegisterView/>
            }
        ]
    },

    {
        element: <PageLayout />,
        children: [
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        id: "home",
                        path: '/home',
                        children: [
                            {
                                index: true,
                                element: <HomeView />
                            },
                            {
                                id: "deliveries overview",
                                path: "deliveries",
                                element: <DeliveriesOverview/>,
                                handle: {
                                    pageTitle: () => {
                                        return <PageTitle pageName="Commandes à livrer" backlink='/home' />
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'Commandes',
                        path: '/commands',
                        children: [
                            {
                                index: true,
                                element: <CommandsListView />,
                                handle: {
                                    pageTitle: () => <PageTitle pageName="Commandes" creationDrawer={<CommandCreationDrawer />} />
                                }
                            },
                            {
                                id: 'commande view',
                                path: ':commandId',
                                element: <CommandDetailView />,
                                handle: {
                                    pageTitle: () => {
                                        return <PageTitle pageName="Détails de la commande" backlink='/commands' />
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: 'Customers',
                        path: '/customers',
                        children: [
                            {
                                index: true,
                                element: <CustomersListView />,
                                handle: {
                                    pageTitle: () => <PageTitle pageName="Vos clients" />
                                }
                            },
                            {
                                id: 'customer view',
                                path: ':customerId',
                                element: <CustomerDetailView />,
                                handle: {
                                    pageTitle: () => {
                                        return <PageTitle pageName="Client" backlink='/commands' />
                                    }
                                }
                            }
                        ]
                    },
                    {
                        id: "services",
                        path: '/services',
                        children: [
                            {
                                index: true,
                                element: <ServicesListView />,
                                handle: {
                                    pageTitle: () => <PageTitle pageName="Services" creationDrawer={<ServiceCreationDrawer />} />
                                }
                            },
                            {
                                id: 'service view',
                                path: 'edit/:serviceId',
                                element: <ServiceEditView />,
                                handle: {
                                    pageTitle: () => <PageTitle pageName={`Service`} backlink='/services' />
                                }
                            }
                        ]
                    },
                    {
                        id: "profile",
                        path: '/profile',
                        element: <ProfileView />
                    },
                ]
            }
        ]
    }



]