import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Profile(){

const { user } = useAuth();

const [userData,setUserData] = useState(null);
const [rank,setRank] = useState(null);
const [badges,setBadges] = useState([]);
const [progress,setProgress] = useState(0);

useEffect(()=>{

if(!user) return;

async function loadProfile(){

try{

/* USER PROFILE DATA */

const userRef = doc(db,"users",user.uid);
const snap = await getDoc(userRef);

if(snap.exists()){

const data = snap.data();

setUserData(data);
setBadges(data.badges || []);

const points = data.points || 0;

/* progress based on points */
setProgress(Math.min(points / 200 * 100,100));

}


/* LEADERBOARD RANK */

const emissionsRef = collection(db,"emissions");
const snapshot = await getDocs(emissionsRef);

let users = [];

snapshot.forEach(d=>{
users.push(d.data());
});

users.sort((a,b)=>a.total - b.total);

const position =
users.findIndex(u=>u.userId === user.uid) + 1;

setRank(position);

}
catch(error){
console.log("Profile error:",error);
}

}

loadProfile();

},[user]);

if(!userData){

return(

<div className="text-center mt-10 text-lg">
Loading profile...
</div>

);

}

return(

<div className="max-w-5xl mx-auto space-y-8">

{/* PROFILE CARD */}

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow flex flex-col md:flex-row items-center gap-6"
>

<img
src={userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`}
alt="avatar"
className="w-32 h-32 rounded-full"
/>

<div>

<h2 className="text-2xl font-bold">
{userData.name}
</h2>

<p className="text-gray-500">
Rank #{rank || "N/A"}
</p>

<p className="text-green-600 font-semibold mt-1">
{userData.points || 0} Eco Points
</p>

</div>

</motion.div>


{/* BADGES */}

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<h3 className="font-bold mb-4 text-lg">
Earned Badges
</h3>

{badges.length === 0 ? (

<p className="text-gray-500">
Complete daily tasks to unlock badges 🌱
</p>

) : (

<div className="flex flex-wrap gap-4">

{badges.map((badge,i)=>(

<motion.div
whileHover={{scale:1.1}}
key={i}
className="bg-green-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
>

🏅 {badge}

</motion.div>

))}

</div>

)}

</motion.div>


{/* PROGRESS TRACKER */}

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<h3 className="font-bold mb-4 text-lg">
Carbon Reduction Progress
</h3>

<div className="bg-gray-200 rounded-full h-4 overflow-hidden">

<motion.div
initial={{width:0}}
animate={{width:`${progress}%`}}
transition={{duration:1}}
className="bg-green-600 h-4"
/>

</div>

<p className="text-sm text-gray-500 mt-2">
Goal: Earn 200 eco points
</p>

</motion.div>

</div>

)

}