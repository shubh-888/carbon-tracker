import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

import { FaLeaf, FaGlobe, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import { motion, AnimatePresence } from "framer-motion";

export default function Navbar(){

const { user } = useAuth();

const [profile,setProfile] = useState(null);
const [open,setOpen] = useState(false);
const [mobileMenu,setMobileMenu] = useState(false);

const navigate = useNavigate();
const menuRef = useRef();

/* FETCH PROFILE */

useEffect(()=>{

if(!user) return;

async function loadProfile(){

try{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(snap.exists()){
setProfile(snap.data());
}

}catch(err){
console.log("Profile fetch error:",err);
}

}

loadProfile();

},[user]);

/* CLOSE DROPDOWN */

useEffect(()=>{

const handleClick=(e)=>{

if(menuRef.current && !menuRef.current.contains(e.target)){
setOpen(false);
}

};

document.addEventListener("click",handleClick);

return ()=>document.removeEventListener("click",handleClick);

},[]);

/* LOGOUT */

const handleLogout = async () => {

try{

await signOut(auth);

setOpen(false);
setMobileMenu(false);

navigate("/",{replace:true});

}catch(err){
console.log(err);
}

};

/* ACTIVE LINK STYLE */

const linkClass = ({isActive}) =>
isActive
? "text-white font-semibold border-b-2 border-white pb-1"
: "hover:text-gray-200";

return(

<nav className="bg-green-700 text-white shadow-md fixed top-0 w-full z-50">

<div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">

{/* LOGO */}

<div
className="flex items-center gap-2 text-lg sm:text-xl font-bold cursor-pointer"
onClick={()=>navigate("/")}
>
<FaLeaf/>
EcoTrack
</div>


{/* DESKTOP LINKS */}

<div className="hidden md:flex items-center gap-6 text-sm">

<NavLink to="/globe" className={linkClass}>
<span className="flex items-center gap-1">
<FaGlobe/> Globe
</span>
</NavLink>

{user && (

<>

<NavLink to="/" className={linkClass}>
Home
</NavLink>

<NavLink to="/dashboard" className={linkClass}>
Dashboard
</NavLink>

<NavLink to="/calculator" className={linkClass}>
Calculator
</NavLink>

<NavLink to="/leaderboard" className={linkClass}>
Leaderboard
</NavLink>

<NavLink to="/social" className={linkClass}>
Social
</NavLink>
<NavLink to="/eco-ai" className={linkClass}>
<span className="flex items-center gap-1">
🤖 Carbon-AI Assistant 
</span>
</NavLink>

</>

)}

</div>


{/* RIGHT SIDE */}

<div className="flex items-center gap-3">

{/* THEME */}

<ThemeToggle/>

{user && <NotificationBell/>}

{/* PROFILE */}

{user && (

<div className="relative hidden md:block" ref={menuRef}>

<img
onClick={()=>setOpen(!open)}
src={
profile?.avatar ||
`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.name || "User"}`
}
alt="profile"
className="w-9 h-9 rounded-full cursor-pointer border-2 border-white hover:scale-105 transition"
/>

{/* PROFILE DROPDOWN */}

{open && (

<div className="absolute right-0 mt-3 w-44 bg-white text-black rounded-xl shadow-lg overflow-hidden">

<button
onClick={()=>{
setOpen(false);
navigate("/profile");
}}
className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>
👤 Profile
</button>

<button
onClick={handleLogout}
className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>
🚪 Logout
</button>

</div>

)}

</div>

)}

{/* MOBILE MENU BUTTON */}

<button
onClick={()=>setMobileMenu(!mobileMenu)}
className="md:hidden text-lg"
>

{mobileMenu ? <FaTimes/> : <FaBars/>}

</button>

</div>

</div>


{/* MOBILE MENU */}

<AnimatePresence>

{mobileMenu && (

<motion.div
initial={{height:0,opacity:0}}
animate={{height:"auto",opacity:1}}
exit={{height:0,opacity:0}}
transition={{duration:0.3}}
className="md:hidden bg-green-800 px-6 py-6 flex flex-col gap-4 text-sm"
>

<NavLink
to="/globe"
onClick={()=>setMobileMenu(false)}
className="block py-1"
>
🌍 Carbon Globe
</NavLink>

{user && (

<>

<NavLink to="/" onClick={()=>setMobileMenu(false)} className="block py-1">
🏠 Home
</NavLink>

<NavLink to="/dashboard" onClick={()=>setMobileMenu(false)} className="block py-1">
📊 Dashboard
</NavLink>

<NavLink to="/calculator" onClick={()=>setMobileMenu(false)} className="block py-1">
🧮 Calculator
</NavLink>

<NavLink to="/leaderboard" onClick={()=>setMobileMenu(false)} className="block py-1">
🏆 Leaderboard
</NavLink>

<NavLink to="/social" onClick={()=>setMobileMenu(false)} className="block py-1">
💬 Social
</NavLink>

<NavLink to="/eco-ai" onClick={()=>setMobileMenu(false)} className="block py-1">
🤖 AI Assistant
</NavLink>

<NavLink to="/profile" onClick={()=>setMobileMenu(false)} className="block py-1">
👤 Profile
</NavLink>

<button
onClick={handleLogout}
className="text-left py-1 text-red-200 hover:text-white"
>
🚪 Logout
</button>

</>

)}

</motion.div>

)}

</AnimatePresence>

</nav>

);
}