import { NavLink } from "react-router-dom";
import {
FaChartLine,
FaHistory,
FaTrophy,
FaTasks,
FaCalculator
} from "react-icons/fa";

export default function Sidebar({ closeSidebar }) {

const linkClass = ({ isActive }) =>
`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm
${isActive
? "bg-green-600 text-white"
: "text-green-100 hover:bg-green-700"}`;

return (

<div className="w-64 h-full bg-green-800 text-white flex flex-col">

{/* HEADER */}

<div className="px-6 py-6 border-b border-green-700">

<h2 className="text-lg font-semibold">
EcoTrack Dashboard
</h2>

</div>


{/* MENU */}

<nav className="flex flex-col gap-2 px-4 py-6">

<NavLink
to="/dashboard"
onClick={closeSidebar}
className={linkClass}
>
<FaChartLine/> Dashboard
</NavLink>

<NavLink
to="/history"
onClick={closeSidebar}
className={linkClass}
>
<FaHistory/> History
</NavLink>

<NavLink
to="/leaderboard"
onClick={closeSidebar}
className={linkClass}
>
<FaTrophy/> Leaderboard
</NavLink>

<NavLink
to="/tasks"
onClick={closeSidebar}
className={linkClass}
>
<FaTasks/> Daily Tasks
</NavLink>

<NavLink
to="/calculator"
onClick={closeSidebar}
className={linkClass}
>
<FaCalculator/> Calculator
</NavLink>

</nav>

</div>

);

}