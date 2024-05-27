import { Params, RouteObject } from "react-router-dom"
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
import { PenLine } from "lucide-react"
import RegisterView from "@/views/register-view"
import { ProtectedRoute } from "./protected-route"


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
                        element: <HomeView />
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
                                    pageTitle: (params: Params) => {
                                        return <PageTitle pageName={`Commande ${params.commandId}`} backlink='/commands' editionDrawer={<PenLine size={20} className="text-blue-600" />} />
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
                                    pageTitle: (params: Params) => {
                                        return <PageTitle pageName={`Service ${params.serviceId}`} backlink='/services' />
                                    }
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