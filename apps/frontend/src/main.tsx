import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from '@/routes/index.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './components/app/providers/auth-provider'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

const env: 'dev' | 'prod' = import.meta.env.VITE_APP_ENVIRONMENT

if (env === 'prod') {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} ></RouterProvider>
          <Toaster />
        </AuthProvider>
    </QueryClientProvider>,
  )
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AuthProvider>
          <RouterProvider router={router} ></RouterProvider>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  )

}
