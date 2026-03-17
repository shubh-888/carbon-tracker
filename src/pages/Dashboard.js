import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import TrendChart from "../components/TrendChart";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function Dashboard(){

const { user } = useAuth();

const [emissions,setEmissions] = useState([]);

useEffect(()=>{

if(!user) return;

/* REALTIME EMISSIONS */

const q = query(
collection(db,"emissions"),
where("userId","==",user.uid)
);

const unsubscribe = onSnapshot(q,(snapshot)=>{

let arr = [];

snapshot.forEach(doc=>{
arr.push(doc.data());
});

setEmissions(arr);

});

return ()=>unsubscribe();

},[user]);

/* CALCULATIONS */

const totalEmission =
emissions.reduce((sum,e)=> sum + (e.total || 0),0);

const avgEmission =
emissions.length
? totalEmission / emissions.length
: 0;

return(

<div className="flex">

{/* SIDEBAR */}

<Sidebar/>

<div className="flex-1 p-8 space-y-8">

{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-2xl font-bold">
Dashboard
</h1>

</div>

{/* STAT CARDS */}

<div className="grid md:grid-cols-3 gap-6">

{/* TOTAL EMISSIONS */}

<motion.div
whileHover={{ scale:1.05 }}
initial={{ opacity:0,y:20 }}
animate={{ opacity:1,y:0 }}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<p className="text-gray-500 text-sm">
Total Emissions
</p>

<h2 className="text-3xl font-bold text-green-600">

<CountUp
end={totalEmission}
duration={2}
decimals={2}
/>

kg CO₂

</h2>

</motion.div>

{/* AVERAGE */}

<motion.div
whileHover={{ scale:1.05 }}
initial={{ opacity:0,y:20 }}
animate={{ opacity:1,y:0 }}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<p className="text-gray-500 text-sm">
Average Emission
</p>

<h2 className="text-3xl font-bold text-blue-600">

<CountUp
end={avgEmission}
duration={2}
decimals={2}
/>

kg

</h2>

</motion.div>

{/* TOTAL CALCULATIONS */}

<motion.div
whileHover={{ scale:1.05 }}
initial={{ opacity:0,y:20 }}
animate={{ opacity:1,y:0 }}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<p className="text-gray-500 text-sm">
Total Calculations
</p>

<h2 className="text-3xl font-bold text-purple-600">

<CountUp
end={emissions.length}
duration={2}
/>

</h2>

</motion.div>

</div>

{/* TREND CHART */}

<motion.div
initial={{ opacity:0,scale:0.95 }}
animate={{ opacity:1,scale:1 }}
transition={{ duration:0.5 }}
className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
>

<h2 className="font-bold mb-4">
Monthly Carbon Trend
</h2>

<TrendChart emissions={emissions}/>

</motion.div>

</div>

</div>

)

}