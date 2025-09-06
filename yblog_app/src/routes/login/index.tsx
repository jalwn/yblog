import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'
import "./login.css"

const Login = () => {

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center p-6 md:p-10 z-50">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export const Route = createFileRoute('/login/')({
    component: Login,
})

