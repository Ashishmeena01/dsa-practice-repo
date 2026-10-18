import { useState } from "react"

export default function Home() {
    const [count] = useState(0)
    return (
        <>i am home {count} </>
    )
}