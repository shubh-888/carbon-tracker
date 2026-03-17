import { useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from "chart.js";

import { motion } from "framer-motion";
import { getAITips } from "../ai/carbonModel";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calculator(){

const [electricity,setElectricity] = useState("");
const [car,setCar] = useState("");
const [publicTransport,setPublicTransport] = useState("");
const [flight,setFlight] = useState("");
const [diet,setDiet] = useState("average");
const [waste,setWaste] = useState("");

const [result,setResult] = useState(null);
const [breakdown,setBreakdown] = useState(null);
const [aiTips,setAiTips] = useState([]);

const calculate = async () => {

const electricityEmission = Number(electricity) * 0.82;
const carEmission = Number(car) * 0.21;
const transportEmission = Number(publicTransport) * 0.11;
const flightEmission = Number(flight) * 0.15;

let dietEmission = 0;

if(diet==="vegan") dietEmission = 50;
if(diet==="vegetarian") dietEmission = 100;
if(diet==="average") dietEmission = 200;
if(diet==="meat") dietEmission = 300;

const wasteEmission = Number(waste) * 0.4;

const total =
electricityEmission +
carEmission +
transportEmission +
flightEmission +
dietEmission +
wasteEmission;

setResult(total);

const emissionData = {
electricity:electricityEmission,
transport:carEmission + transportEmission,
flights:flightEmission,
diet:dietEmission,
waste:wasteEmission
};

setBreakdown(emissionData);

/* AI Suggestions */

const ai = getAITips(emissionData);
setAiTips(ai.tips);

/* Firebase Save */

const user = auth.currentUser;

if(!user){
alert("Please login first");
return;
}

await addDoc(collection(db,"emissions"),{
userId:user.uid,
...emissionData,
total:total,
date:Timestamp.now()
});

};

/* PIE CHART DATA */

const pieData = breakdown && {

labels:["Electricity","Transport","Flights","Diet","Waste"],

datasets:[{
data:[
breakdown.electricity,
breakdown.transport,
breakdown.flights,
breakdown.diet,
breakdown.waste
],
backgroundColor:[
"#22c55e",
"#3b82f6",
"#f97316",
"#8b5cf6",
"#ef4444"
]
}]

};

return(

<div className="max-w-4xl mx-auto space-y-10">

{/* CALCULATOR FORM */}

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow"
>

<h2 className="text-2xl font-bold mb-6 text-center">
Carbon Footprint Calculator
</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
type="number"
placeholder="Electricity Usage (kWh/month)"
value={electricity}
onChange={(e)=>setElectricity(e.target.value)}
className="border p-3 rounded"
/>

<input
type="number"
placeholder="Car Travel (km/month)"
value={car}
onChange={(e)=>setCar(e.target.value)}
className="border p-3 rounded"
/>

<input
type="number"
placeholder="Public Transport (km/month)"
value={publicTransport}
onChange={(e)=>setPublicTransport(e.target.value)}
className="border p-3 rounded"
/>

<input
type="number"
placeholder="Flight Distance (km/year)"
value={flight}
onChange={(e)=>setFlight(e.target.value)}
className="border p-3 rounded"
/>

<select
value={diet}
onChange={(e)=>setDiet(e.target.value)}
className="border p-3 rounded"
>

<option value="vegan">Vegan</option>
<option value="vegetarian">Vegetarian</option>
<option value="average">Average Diet</option>
<option value="meat">Meat Heavy</option>

</select>

<input
type="number"
placeholder="Waste Generated (kg/month)"
value={waste}
onChange={(e)=>setWaste(e.target.value)}
className="border p-3 rounded"
/>

</div>

<button
onClick={calculate}
className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
>
Calculate Carbon Footprint
</button>

</motion.div>


{/* RESULT SECTION */}

{result !== null && (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow space-y-8"
>

<h2 className="text-xl font-bold text-center">
Your Carbon Footprint
</h2>

<p className="text-center text-4xl font-bold text-green-600">
{result.toFixed(2)} kg CO₂
</p>

{/* PIE CHART */}

<div className="max-w-sm mx-auto">
<Pie data={pieData}/>
</div>


{/* AI SUGGESTIONS */}

<div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">

<h3 className="font-semibold mb-3">
AI Sustainability Suggestions
</h3>

<ul className="space-y-2 text-gray-700 dark:text-gray-200">

{aiTips.map((tip,i)=>(
<li key={i}>
🌱 {tip}
</li>
))}

</ul>

</div>

</motion.div>

)}

</div>

);

}