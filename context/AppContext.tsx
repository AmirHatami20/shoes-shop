"use client";

import {createContext, useContext, useState, ReactNode} from "react";
import {Category, User} from "@/types";

interface AppContextType {
    user: User | null;
    categories: Category[];
}

const AppContext = createContext<AppContextType>({
    user: null,
    categories: [],
});

export const useApp = () => useContext(AppContext);

interface AppProviderProps {
    user: User | null;
    categories: Category[];
    children: ReactNode;
}

export function AppProvider({user, categories, children}: AppProviderProps) {
    const [u] = useState<User | null>(user);
    const [c] = useState(categories);

    return (
        <AppContext.Provider value={{user: u, categories: c,}}>
            {children}
        </AppContext.Provider>
    );
}
