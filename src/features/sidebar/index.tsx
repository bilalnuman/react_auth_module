import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Sidebar.module.css";

type SubMenu = {
    label: string;
    path: string;
    icon?: React.ReactNode;
};

type MenuItem = {
    label: string;
    path: string;
    icon?: React.ReactNode;
    subMenu?: SubMenu[];
};

interface SidebarProps {
    logo?: React.ReactNode | string;
    menuItems: MenuItem[];
    sticky?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ logo, menuItems, sticky = true }) => {
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState<string>("");

    const toggleMenu = (path: string) => {
        setOpenMenu(prev => (prev === path ? "" : path));
    };

    const isRouteActive = (item: MenuItem) => {
        if (location.pathname === item.path) return true;

        if (item.subMenu) {
            return item.subMenu.some((sub) =>
                location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
            );
        }

        return false;
    };



    useEffect(() => {
        const matchedMenuItem = menuItems.find(item => {
            if (location.pathname === item.path) return true;

            if (item.subMenu) {
                return item.subMenu.some(sub =>
                    location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
                );
            }

            return false;
        });

        if (matchedMenuItem) {
            setOpenMenu(matchedMenuItem.path);
        }
    }, [location.pathname, menuItems]);





    return (
        <aside
            className={styles.sidebar}
            style={{ position: sticky ? "sticky" : "relative" }}
        >

            {logo && (
                <div className={styles.logo}>
                    {typeof logo === "string" ? <img src={logo} alt="Logo" /> : logo}
                </div>
            )}

            {menuItems.map((item) => {
                const isActiveMain = isRouteActive(item);
                const isSubMenuOpen = openMenu === item.path;

                return (
                    <nav key={item.path}>
                        <NavLink
                            to={item.subMenu ? "#" : item.path}
                            className={`${styles.menuItem} ${isActiveMain ? styles.active : ""}`}
                            onClick={() => item.subMenu && toggleMenu(item.path)}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                                <span>{item.label}</span>
                            </div>

                            {item.subMenu && (
                                <FiChevronDown
                                    className={`${styles.caret} ${isSubMenuOpen ? styles.caretOpen : ""}`}
                                    size={18}
                                />
                            )}
                        </NavLink>

                        {item.subMenu && (
                            <div
                                className={`${styles.subMenu} ${isSubMenuOpen ? styles.subMenuOpen : ""}`}
                            >
                                {item.subMenu.map((sub) => {
                                    return (
                                        <NavLink
                                            to={sub.path}
                                            key={sub.path}
                                            style={{ display: "flex", alignItems: "center" }}
                                            className={({ isActive }) =>
                                                `${styles.subMenuItem} ${isActive ? styles.active : ""}`
                                            }

                                        >
                                            {sub?.icon && <span className={styles.icon}>{sub.icon}</span>}
                                            {sub.label}
                                        </NavLink>
                                    )
                                })}
                            </div>
                        )}
                    </nav>
                );
            })}
        </aside>
    );
};


export default Sidebar;
