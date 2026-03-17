import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { FaLeaf } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){

const { user } = useAuth();

const [profile,setProfile] = useState(null);
const [open,setOpen] = useState(false);

const navigate = useNavigate();

useEffect(()=>{

if(!user) return;

async function loadProfile(){

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){
setProfile(snap.data());
}

}

loadProfile();

},[user]);

const handleLogout = async () => {

await signOut(auth);

navigate("/login");

};

return(

<nav className="bg-green-700 text-white shadow">

<div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

{/* LOGO */}

<div className="flex items-center gap-2 text-xl font-bold">
<FaLeaf/>
EcoTrack
</div>


{/* NAV LINKS */}

<div className="flex items-center gap-6 text-sm">

<NavLink to="/">Home</NavLink>

{user && <NavLink to="/calculator">Calculator</NavLink>}

{user && <NavLink to="/dashboard">Dashboard</NavLink>}

{user && <NavLink to="/leaderboard">Leaderboard</NavLink>}

</div>


{/* PROFILE MENU */}

{user && profile && (

<div className="relative">

<img
onClick={()=>setOpen(!open)}
src={
profile.avatar ||
`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`
}
alt="profile"
className="w-10 h-10 rounded-full cursor-pointer"
/>

{/* DROPDOWN */}

{open && (

<div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow">

<button
onClick={()=>navigate("/profile")}
className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>

Profile

</button>

<button
onClick={handleLogout}
className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>

Logout

</button>

</div>

)}

</div>

)}

</div>

</nav>

);

}