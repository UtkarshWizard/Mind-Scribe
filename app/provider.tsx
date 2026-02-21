"use client"

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import NavigationProgress from "./components/NavigationProgress";

export function Providers ({children}: {
    children : React.ReactNode
}) {
    return <SessionProvider>
        <Suspense fallback={null}>
            <NavigationProgress />
        </Suspense>
        {children}
        <Toaster />
    </SessionProvider>
}