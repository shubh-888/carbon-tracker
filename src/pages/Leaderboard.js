import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

export default function Leaderboard(){

const [users,setUsers] = useState([]);
const [userMap,setUserMap] = useState({});
const [timeFilter,setTimeFilter] = useState("all");
const [tab,setTab] = useState("global");
const [loading,setLoading] = useState(true);


/* LOAD USERS */

useEffect(()=>{

const unsubscribe = onSnapshot(collection(db,"users"),(snapshot)=>{

let map = {};

snapshot.forEach(doc=>{
map[doc.id] = doc.data().name || "User";
});

setUserMap(map);

});

return ()=>unsubscribe();

},[]);



/* LOAD EMISSIONS */

useEffect(()=>{

const unsubscribe = onSnapshot(collection(db,"emissions"),(snapshot)=>{

let arr = [];

snapshot.forEach(doc=>{
arr.push(doc.data());
});


/* GROUP BY USER */

let map = {};

arr.forEach(item=>{

if(!map[item.userId]){
map[item.userId] = { total:0,count:0 };
}

map[item.userId].total += item.total;
map[item.userId].count++;

});


/* BUILD RESULT */

let result = Object.keys(map).map(uid=>{

let avg = map[uid].total / map[uid].count;

let score = Math.max(0,1000 - avg * 2);

return {
userId:uid,
name:userMap[uid] || "Unknown",
emission:avg,
score
};

});


/* SORT */

result.sort((a,b)=>a.emission - b.emission);

setUsers(result);
setLoading(false);

});

return ()=>unsubscribe();

},[userMap]);



/* LOADING SCREEN */

if(loading){
return(
<Layout>
<div className="flex items-center justify-center min-h-screen dark:text-white">
Loading leaderboard...
</div>
</Layout>
);
}



return(

<Layout>

<div className="w-full px-4 md:px-8 py-6 space-y-6">

<h1 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
🌿 Eco Leaderboard
</h1>



{/* FILTER BUTTONS */}

<div className="flex flex-wrap gap-3">

{["today","week","month","all"].map(f=>(

<button
key={f}
onClick={()=>setTimeFilter(f)}
className={`px-4 py-2 rounded-full text-sm transition

${timeFilter===f
? "bg-green-600 text-white"
: "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200"}

`}
>

{f}

</button>

))}



{["global","india","friends"].map(t=>(

<button
key={t}
onClick={()=>setTab(t)}
className={`px-4 py-2 rounded-full text-sm transition

${tab===t
? "bg-blue-600 text-white"
: "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200"}

`}
>

{t}

</button>

))}

</div>



{/* TABLE CARD */}

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="rounded-2xl shadow overflow-x-auto
bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg"
>


<table className="min-w-[700px] w-full text-sm">


<thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">

<tr>

<th className="p-4 text-left">Rank</th>
<th className="p-4 text-left">User</th>
<th className="p-4 text-left">Score</th>
<th className="p-4 text-left">Emission</th>
<th className="p-4 text-left">Progress</th>

</tr>

</thead>



<tbody>

{users.map((user,index)=>{

const isMe = user.userId === auth.currentUser?.uid;


/* MEDALS */

let medal="";
if(index===0) medal="🥇";
if(index===1) medal="🥈";
if(index===2) medal="🥉";


/* BADGE */

let badge="🌿";
if(user.score>800) badge="🌍";
if(user.score>900) badge="🔥";


/* PROGRESS */

let progress=Math.min(100,user.score/10);


/* INITIALS */

const initials=user.name
?.split(" ")
.map(w=>w[0])
.join("")
.toUpperCase();



return(

<motion.tr
key={user.userId}
initial={{opacity:0}}
animate={{opacity:1}}
className={`border-t transition
hover:bg-gray-50 dark:hover:bg-gray-700

${isMe ? "bg-green-100/60 dark:bg-green-900/30" : ""}

`}
>


{/* RANK */}

<td className="p-4 font-bold text-lg">

{medal || `#${index+1}`}

</td>



{/* USER */}

<td className="p-4">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-green-600 text-white
flex items-center justify-center
rounded-full font-semibold">

{initials || "U"}

</div>

<span className="font-medium text-gray-800 dark:text-gray-200">

{user.name} {badge}

</span>

</div>

</td>



{/* SCORE */}

<td className="p-4 text-green-600 font-bold">

{Math.round(user.score)}

</td>



{/* EMISSION */}

<td className="p-4 text-gray-800 dark:text-gray-200">

{user.emission.toFixed(2)} kg

</td>



{/* PROGRESS BAR */}

<td className="p-4 w-48">

<div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full">

<div
className="bg-green-600 h-2 rounded-full transition-all"
style={{width:`${progress}%`}}
></div>

</div>

</td>

</motion.tr>

);

})}

</tbody>

</table>

</motion.div>

</div>

</Layout>

);
}