import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results({ electricity=950, transport=1100, flights=900, diet=300 }) {

const data = {
labels: ["Electricity", "Transport", "Flights", "Diet"],
datasets: [
{
data: [electricity, transport, flights, diet],
backgroundColor: [
"#22c55e",
"#3b82f6",
"#f97316",
"#eab308"
],
borderWidth: 1
}
]
};

const total = electricity + transport + flights + diet;

return (

<div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow max-w-5xl mx-auto">

<h2 className="text-center text-2xl font-bold mb-6">
Your Carbon Footprint
</h2>

<div className="text-center mb-8">

<div className="bg-green-700 text-white text-3xl font-bold py-6 rounded-lg">
{total} kg CO₂ / year
</div>

<span className="bg-red-500 text-white px-3 py-1 rounded mt-3 inline-block">
High
</span>

</div>

<div className="grid md:grid-cols-2 gap-8">

<div className="w-full max-w-sm mx-auto">
<Pie data={data} />
</div>

<div className="space-y-4 text-lg">

<p>⚡ Electricity: {electricity} kg</p>
<p>🚗 Transport: {transport} kg</p>
<p>✈ Flights: {flights} kg</p>
<p>🥗 Diet: {diet} kg</p>

</div>

</div>

<div className="flex justify-between mt-8">

<button className="bg-green-600 text-white px-6 py-2 rounded">
Download Report
</button>

<button className="bg-gray-300 px-6 py-2 rounded">
Recalculate
</button>

</div>

</div>

);

}