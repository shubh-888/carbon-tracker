import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {

const { user } = useAuth();
const [sidebarOpen,setSidebarOpen] = useState(false);

return(

<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

{/* NAVBAR */}

<Navbar />


{/* SIDEBAR DRAWER */}

{sidebarOpen && (

<div className="fixed inset-0 z-40 flex">

{/* SIDEBAR */}

<div className="w-64 bg-green-800">

<Sidebar closeSidebar={()=>setSidebarOpen(false)} />

</div>

{/* OVERLAY */}

<div
className="flex-1 bg-black/40"
onClick={()=>setSidebarOpen(false)}
></div>

</div>

)}


{/* MAIN CONTENT */}

<main className="flex-1 w-full pt-24 px-4 md:px-8 pb-10">

{/* MENU BUTTON (only when logged in) */}

{user && (

<button
onClick={()=>setSidebarOpen(true)}
className="text-2xl text-green-600 dark:text-green-400 mb-6"
>
<FaBars/>
</button>

)}

{children}

</main>


{/* FOOTER */}

<footer className="w-full py-6 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">

© 2026 EcoTrack. Making the world more sustainable.

</footer>

</div>

);

}