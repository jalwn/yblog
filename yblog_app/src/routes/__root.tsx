import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar05 as Navbar } from '@/components/ui/shadcn-io/navbar-05';
import logo from "../assets/skin-care.png"


const RouteComponent = () => {
    const router = useRouter()

    const handleNavigation = (href: string) => {
        router.navigate({ to: href })
    }

    return (
        <>
            <Navbar
                logo={<img src={logo} alt="Logo" className="h-20 w-20" />}
                navigationLinks={[
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About' },
                    { href: '/login', label: 'Login' },
                ]}
                onNavItemClick={handleNavigation}
            />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    )
}

export const Route = createRootRoute({
    component: () => (
        <>
            <RouteComponent></RouteComponent>
        </>
    ),
})