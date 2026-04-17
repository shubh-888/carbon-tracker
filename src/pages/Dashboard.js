import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
collection,
query,
where,
onSnapshot,
doc,
getDoc
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import TrendChart from "../components/TrendChart";
import Layout from "../components/Layout";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function Dashboard(){

const { user } = useAuth();

const [emissions,setEmissions] = useState([]);
const [profile,setProfile] = useState(null);
const [loading,setLoading] = useState(true);

/* LOAD DATA */

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

const q = query(
collection(db,"emissions"),
where("userId","==",user.uid)
);

const unsubscribe = onSnapshot(q,(snapshot)=>{

let arr=[];

snapshot.forEach(doc=>{
arr.push(doc.data());
});

setEmissions(arr);
setLoading(false);

});

return ()=>unsubscribe();

},[user]);

/* CALCULATIONS */

const total =
emissions.reduce((sum,e)=>sum+(e.total||0),0);

const avg =
emissions.length ? total/emissions.length : 0;

const last =
emissions[emissions.length-1]?.total || 0;

const prev =
emissions[emissions.length-2]?.total || 0;

const improvement =
prev ? (((prev-last)/prev)*100).toFixed(1) : 0;

/* KPI CARDS */

const stats=[

{
title:"Total Emissions",
value:total,
color:"text-green-600",
suffix:"kg"
},

{
title:"Average Emission",
value:avg,
color:"text-blue-600",
suffix:"kg"
},

{
title:"Calculations",
value:emissions.length,
color:"text-purple-600",
suffix:""
}

];

if(loading){

return(

<Layout>

<div className="flex justify-center items-center min-h-screen dark:text-white">

Loading Dashboard...

</div>

</Layout>

);

}

return(

<Layout>

{/* HEADER */}

<motion.div initial={{opacity:0}} animate={{opacity:1}}>

<h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">

Welcome back 👋 {profile?.name || ""}

</h1>

</motion.div>


{/* KPI CARDS */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

{stats.map((card,i)=>(

<motion.div
key={i}
whileHover={{scale:1.03}}
className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow"
>

<p className="text-sm text-gray-500">
{card.title}
</p>

<h2 className={`text-3xl font-bold ${card.color}`}>

<CountUp end={card.value} duration={2} decimals={2}/>

{" "} {card.suffix}

</h2>

</motion.div>

))}

</div>


{/* CHART */}

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl shadow mb-8"
>

<h2 className="font-semibold text-lg mb-4">

📈 Monthly Carbon Trend

</h2>

<TrendChart emissions={emissions}/>

</motion.div>


{/* PERFORMANCE */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">

<h3 className="font-semibold">

🎯 Improvement

</h3>

<p className={`text-2xl mt-3 font-bold ${
improvement >=0 ? "text-green-600":"text-red-500"
}`}>

{improvement}%

</p>

</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">

<h3 className="font-semibold">

📊 Current Emission

</h3>

<p className="text-2xl text-green-600 font-bold mt-3">

{last.toFixed(1)} kg

</p>

</div>

</div>

</Layout>

);

}