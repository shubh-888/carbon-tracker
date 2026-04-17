import { useState } from "react";
import Layout from "../components/Layout";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getAIInsight } from "../lib/ai/getAIInsight";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calculator(){

const [form,setForm] = useState({
household:"1",
homeType:"",
carKm:"",
carType:"",
publicKm:"",
flights:"",
electricity:"",
gas:"",
solar:"no",
diet:"",
meatMeals:"",
shopping:"",
recycle:""
});

const [result,setResult] = useState(null);
const [aiInsight,setAiInsight] = useState("");
const [error,setError] = useState("");

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const calculate=async()=>{

if(!form.carKm || !form.electricity || !form.diet){
setError("Car travel, electricity and diet are required.");
return;
}

setError("");

let carFactor=0.21;
if(form.carType==="diesel") carFactor=0.25;
if(form.carType==="hybrid") carFactor=0.12;
if(form.carType==="electric") carFactor=0.05;

const car=form.carKm*carFactor;
const publicT=form.publicKm*0.05;
const flights=form.flights*150;

let electricity=form.electricity*0.4;

if(form.solar==="yes"){
electricity=electricity*0.6;
}

const gas=form.gas*2;

let diet=2;

if(form.diet==="vegan") diet=1.5;
if(form.diet==="vegetarian") diet=2;
if(form.diet==="mixed") diet=2.5;
if(form.diet==="meat") diet=3.5;

const meat=form.meatMeals*0.8;

const shopping=form.shopping*6;

let recycleImpact=2;

if(form.recycle==="always") recycleImpact=0.5;
if(form.recycle==="sometimes") recycleImpact=1;

const total=
car+
publicT+
flights+
electricity+
gas+
diet+
meat+
shopping+
recycleImpact;

const score=Math.max(10,100-total/10);

setResult({
car,
publicT,
flights,
electricity,
gas,
diet,
meat,
shopping,
recycleImpact,
total,
score
});

const user=auth.currentUser;

if(user){
await addDoc(collection(db,"emissions"),{
userId:user.uid,
...form,
total,
date:Timestamp.now()
});
}

const insight=await getAIInsight({
avg:total,
prediction:total
});

setAiInsight(insight);

};

const chartData=result?{

labels:[
"Car",
"Public Transport",
"Flights",
"Electricity",
"Gas",
"Diet",
"Shopping"
],

datasets:[
{
data:[
result.car,
result.publicT,
result.flights,
result.electricity,
result.gas,
result.diet,
result.shopping
],
backgroundColor:[
"#22c55e",
"#3b82f6",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#10b981",
"#eab308"
]
}
]

}:null;

return(

<Layout>

<div className="max-w-6xl mx-auto px-4 py-6 space-y-8">

<h1 className="text-3xl font-bold text-green-500">
🌍 Carbon Footprint Calculator
</h1>

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">

{/* Household */}

<h2 className="font-semibold text-lg">👨‍👩‍👧 Household</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
type="number"
name="household"
placeholder="Household members"
value={form.household}
onChange={handleChange}
className="input"
/>

<select
name="homeType"
value={form.homeType}
onChange={handleChange}
className="input"
>
<option value="">Home type</option>
<option value="apartment">Apartment</option>
<option value="small">Small house</option>
<option value="large">Large house</option>
</select>

</div>

{/* Transport */}

<h2 className="font-semibold text-lg">🚗 Transport</h2>

<div className="grid md:grid-cols-3 gap-4">

<input
type="number"
name="carKm"
placeholder="Car km/week *"
value={form.carKm}
onChange={handleChange}
className="input"
/>

<select
name="carType"
value={form.carType}
onChange={handleChange}
className="input"
>
<option value="">Car type</option>
<option value="petrol">Petrol</option>
<option value="diesel">Diesel</option>
<option value="hybrid">Hybrid</option>
<option value="electric">Electric</option>
</select>

<input
type="number"
name="publicKm"
placeholder="Public transport km/week"
value={form.publicKm}
onChange={handleChange}
className="input"
/>

<input
type="number"
name="flights"
placeholder="Flights per year"
value={form.flights}
onChange={handleChange}
className="input"
/>

</div>

{/* Energy */}

<h2 className="font-semibold text-lg">🏠 Home Energy</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
type="number"
name="electricity"
placeholder="Electricity kWh/month *"
value={form.electricity}
onChange={handleChange}
className="input"
/>

<input
type="number"
name="gas"
placeholder="Gas cylinders/month"
value={form.gas}
onChange={handleChange}
className="input"
/>

<select
name="solar"
value={form.solar}
onChange={handleChange}
className="input"
>
<option value="no">Solar panels: No</option>
<option value="yes">Solar panels: Yes</option>
</select>

</div>

{/* Food */}

<h2 className="font-semibold text-lg">🍽 Food</h2>

<div className="grid md:grid-cols-2 gap-4">

<select
name="diet"
value={form.diet}
onChange={handleChange}
className="input"
>
<option value="">Diet type *</option>
<option value="vegan">Vegan</option>
<option value="vegetarian">Vegetarian</option>
<option value="mixed">Mixed</option>
<option value="meat">High meat</option>
</select>

<input
type="number"
name="meatMeals"
placeholder="Meat meals per week"
value={form.meatMeals}
onChange={handleChange}
className="input"
/>

</div>

{/* Lifestyle */}

<h2 className="font-semibold text-lg">🛍 Lifestyle</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
type="number"
name="shopping"
placeholder="Online orders/month"
value={form.shopping}
onChange={handleChange}
className="input"
/>

<select
name="recycle"
value={form.recycle}
onChange={handleChange}
className="input"
>
<option value="">Recycling habit</option>
<option value="always">Always</option>
<option value="sometimes">Sometimes</option>
<option value="never">Never</option>
</select>

</div>

{error &&(
<p className="text-red-500">{error}</p>
)}

<button
onClick={calculate}
className="bg-green-600 hover:bg-green-700 w-full py-3 rounded-lg text-white font-semibold"
>
Calculate Footprint
</button>

</div>

{/* Result */}

{result &&(

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">

<h2 className="text-lg font-semibold">
Your Carbon Footprint
</h2>

<p className="text-4xl font-bold text-green-500 mt-3">
{result.total.toFixed(2)}
</p>

<p className="text-gray-500">
kg CO₂ / month
</p>

<div className="mt-4">

<p className="text-sm mb-1">
Carbon Score
</p>

<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">

<div
className="bg-green-500 h-3 rounded-full"
style={{width:`${result.score}%`}}
></div>

</div>

</div>

</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h2 className="text-lg font-semibold mb-4">
Emission Breakdown
</h2>

<div className="max-w-sm mx-auto">
<Pie data={chartData}/>
</div>

</div>

</div>

)}

{/* AI */}

{aiInsight &&(

<div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl shadow">

<h2 className="font-semibold text-lg mb-2">
🌱 AI Recommendation
</h2>

<p>{aiInsight}</p>

</div>

)}

</div>

</Layout>

);
}