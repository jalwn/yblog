import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [count, setCount] = useState(0)
    return (
        <>
            <h1>Yayyu's Blog</h1>
            <div className="card">
                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
            </div>
        </>
    )
}