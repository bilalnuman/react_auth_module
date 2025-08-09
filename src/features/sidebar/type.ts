import type { ReactNode } from "react";


export interface MenuItem {
    key: string;
    label: string;
    icon?: ReactNode;
    path?: string;
    onClick?: () => void;
    subMenu?: { label: string; path?: string; onClick?: () => void }[];
}

export interface SidebarProps {
    menuItems: MenuItem[];
    logo?: string | ReactNode;
    sticky?: boolean;
    customClass?: string;
}
