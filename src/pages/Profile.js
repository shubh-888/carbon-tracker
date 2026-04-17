import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
doc,
getDoc,
updateDoc,
collection,
onSnapshot
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";

/* CONFETTI */

function launchConfetti(){

for(let i=0;i<80;i++){

const el=document.createElement("div");

el.style.position="fixed";
el.style.width="8px";
el.style.height="8px";
el.style.background=`hsl(${Math.random()*360},70%,60%)`;
el.style.left=Math.random()*window.innerWidth+"px";
el.style.top=Math.random()*window.innerHeight+"px";
el.style.borderRadius="50%";
el.style.zIndex="9999";

document.body.appendChild(el);

setTimeout(()=>el.remove(),1500);

}

}

export default function Profile(){

const { user } = useAuth();

const [userData,setUserData] = useState(null);
const [badges,setBadges] = useState([]);
const [stats,setStats] = useState({total:0,count:0});
const [rank,setRank] = useState("-");
const [celebration,setCelebration] = useState(null);
const [loading,setLoading] = useState(true);

/* BADGE RULES */

const badgeRules=[

{ name:"Eco Beginner 🌱",target:1 },
{ name:"Eco Saver 🌿",target:5 },
{ name:"Green Warrior 🌳",target:10 },
{ name:"Carbon Hero 🌍",target:20 },
{ name:"Climate Champion 🌎",target:30 }

];

useEffect(()=>{

if(!user) return;

const userRef=doc(db,"users",user.uid);

/* LOAD USER */

getDoc(userRef).then(snap=>{

if(snap.exists()){

const data=snap.data();

setUserData(data);
setBadges(data.badges||[]);

}

setLoading(false);

});

/* EMISSIONS */

const unsub=onSnapshot(collection(db,"emissions"),async snapshot=>{

let arr=[];

snapshot.forEach(d=>arr.push(d.data()));

const my=arr.filter(e=>e.userId===user.uid);

const total=my.reduce((s,e)=>s+(e.total||0),0);

setStats({
total,
count:my.length
});

/* RANK */

const userTotals={};

arr.forEach(e=>{

if(!userTotals[e.userId]){
userTotals[e.userId]=0;
}

userTotals[e.userId]+=e.total||0;

});

const sorted=Object.entries(userTotals)
.sort((a,b)=>a[1]-b[1]);

const pos=sorted.findIndex(e=>e[0]===user.uid)+1;

if(pos>0) setRank(pos);

/* BADGES */

let unlocked=[];

badgeRules.forEach(b=>{
if(my.length>=b.target){
unlocked.push(b.name);
}
});

const oldBadges=userData?.badges||[];
const seenBadges=userData?.seenBadges||[];

const merged=[...new Set([...oldBadges,...unlocked])];

const newBadge=merged.find(b=>!seenBadges.includes(b));

/* NEW BADGE */

if(newBadge){

launchConfetti();

setCelebration(newBadge);

const audio=new Audio("/sounds/badge.mp3");
audio.play().catch(()=>{});

await updateDoc(userRef,{
badges:merged,
seenBadges:[...seenBadges,newBadge]
});

setUserData({
...userData,
badges:merged,
seenBadges:[...seenBadges,newBadge]
});

}else{

await updateDoc(userRef,{
badges:merged
});

}

setBadges(merged);

});

return()=>unsub();

},[user,userData]);

if(loading){
return(
<div className="flex items-center justify-center min-h-screen">
Loading profile...
</div>
);
}

/* NEXT BADGE */

const nextBadge=badgeRules.find(b=>!badges.includes(b.name));

const progress=nextBadge
? Math.min((stats.count/nextBadge.target)*100,100)
:100;

/* AVATAR */

const avatar=`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name||"User"}`;

return(

<div className="w-full px-4 md:px-8 py-8 space-y-8">

{/* HEADER */}

<div className="bg-green-600 text-white p-6 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">

<div className="flex items-center gap-5">

<img
src={avatar}
className="w-16 h-16 rounded-full border-2 border-white"
/>

<div>

<h2 className="text-2xl font-bold">
{userData.name}
</h2>

<p>🏆 Rank #{rank}</p>

<p>🔥 Streak: {userData.streak||0} days</p>

</div>

</div>

<p className="text-xl font-semibold">
{stats.total.toFixed(2)} kg CO₂
</p>

</div>


{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow">

<p className="text-gray-500">Total Calculations</p>

<p className="text-3xl font-bold mt-2">
{stats.count}
</p>

</div>

<div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow">

<p className="text-gray-500">Total Emissions</p>

<p className="text-3xl font-bold text-green-600 mt-2">
{stats.total.toFixed(2)} kg
</p>

</div>

<div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow">

<p className="text-gray-500">Daily Streak</p>

<p className="text-3xl font-bold text-orange-500 mt-2">
{userData.streak||0} 🔥
</p>

</div>

</div>


{/* BADGES */}

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h3 className="font-bold mb-6">
🏅 Achievements
</h3>

<div className="grid grid-cols-2 md:grid-cols-5 gap-4">

{badgeRules.map((b,i)=>{

const unlocked=badges.includes(b.name);

return(

<div
key={i}
className={`p-4 rounded-xl text-center shadow transition hover:scale-105
${unlocked
? "bg-green-600 text-white"
: "bg-gray-200 dark:bg-gray-700 text-gray-400"
}`}
>

<p className="font-semibold">{b.name}</p>

{!unlocked && <p className="text-xs">Locked</p>}

</div>

);

})}

</div>


{/* PROGRESS */}

{nextBadge &&(

<div className="mt-6">

<p className="text-sm mb-2">

Next Badge: <b>{nextBadge.name}</b>

</p>

<div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded-full">

<div
className="bg-green-600 h-3 rounded-full transition-all duration-500"
style={{width:`${progress}%`}}
></div>

</div>

</div>

)}

</div>


{/* BADGE MODAL */}

{celebration &&(

<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

<div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center">

<h2 className="text-2xl font-bold mb-4">
🎉 Badge Unlocked!
</h2>

<p className="text-lg text-green-600 font-semibold">
{celebration}
</p>

<button
onClick={()=>setCelebration(null)}
className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:scale-105 transition"
>

Awesome!

</button>

</div>

</div>

)}

</div>

);

}