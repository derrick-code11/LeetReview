import { Outlet } from "react-router"

const Layout = () => {
    return (
        <div className="w-screen h-screen relative">
            <Outlet />     
        </div>
    )
}