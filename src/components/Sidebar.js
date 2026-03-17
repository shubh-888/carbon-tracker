import { NavLink } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import {
FaChartLine,
FaHistory,
FaUser,
FaTrophy
} from "react-icons/fa";

export default function Sidebar(){

const linkClass =
"flex items-center gap-3 p-3 rounded hover:bg-green-700";

const activeClass =
"bg-green-700";

return(

<div className="w-64 bg-green-800 text-white min-h-screen p-6">

<h2 className="font-bold text-lg mb-8">
Dashboard
</h2>

<nav className="space-y-2">

<NavLink
to="/dashboard"
className={({isActive}) =>
`${linkClass} ${isActive ? activeClass : ""}`
}
>
<FaChartLine/>
Dashboard
</NavLink>

<NavLink
to="/history"
className={({isActive}) =>
`${linkClass} ${isActive ? activeClass : ""}`
}
>
<FaHistory/>
History
</NavLink>

<NavLink
to="/leaderboard"
className={({isActive}) =>
`${linkClass} ${isActive ? activeClass : ""}`
}
>
<FaTrophy/>
Leaderboard
</NavLink>


<NavLink
to="/tasks"
className={({isActive}) =>
`${linkClass} ${isActive ? activeClass : ""}`
}
>
<FaTasks/>
Daily Tasks
</NavLink>

<NavLink
to="/profile"
className={({isActive}) =>
`${linkClass} ${isActive ? activeClass : ""}`
}
>
<FaUser/>
Profile
</NavLink>

</nav>

</div>

)

}
