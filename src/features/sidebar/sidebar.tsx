import SidebarComponent from "./index";
import { FiHome, FiUser } from 'react-icons/fi';

export default function Sidebar() {
    const menu = [
        {
            key: '/',
            label: 'Products',
            icon: <FiHome />,
            path: '/',
        },
        {
            key: 'charts',
            label: 'Charts',
            icon: <FiHome />,
            path: '/charts',
        },
        {
            key: 'dataTableWidget',
            label: 'Data Table Widget',
            icon: <FiHome />,
            path: '/dataTableWidget',
        },
        {
            key: 'searchInput',
            label: 'Search Input & and filters',
            icon: <FiHome />,
            path: '/searchInput',
        },
        {
            key: 'chatbot',
            label: 'chatbot',
            icon: <FiHome />,
            path: '/chatbot',
        },
        {
            key: 'file-uploader',
            label: 'file uploader',
            icon: <FiHome />,
            path: '/file-uploader',
        },
        {
            key: 'forms',
            label: 'Forms',
            icon: <FiUser />,
            path: '/forms',
            subMenu: [
                { label: 'register', path: '/register' },
                { label: 'login', path: '/login' },
                { label: 'forgot password', path: '/forgot-password' },
                { label: 'reset password', path: '/reset-password' },
                { label: 'otp', path: '/otp' },
            ],
        }
    ];


    return (
        <SidebarComponent
            menuItems={menu}
            // logo="https://via.placeholder.com/100"
            sticky={true}
        />
    );
}

