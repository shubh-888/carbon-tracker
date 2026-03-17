import { Bar } from "react-chartjs-2";

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
);

export default function ComparisonChart({ userEmission }) {

const globalAverage = 4.7;   // tons per person per year
const indiaAverage = 2.0;    // tons per person per year

const data = {
labels: ["Global Average", "India Average", "Your Emission"],
datasets: [
{
label: "CO₂ tons per person / year",
data: [globalAverage, indiaAverage, userEmission],
backgroundColor: [
"#f97316",
"#3b82f6",
"#22c55e"
],
borderRadius: 8
}
]
};

const options = {
responsive: true,
plugins: {
legend: {
display: false
}
},
scales: {
y: {
beginAtZero: true,
title: {
display: true,
text: "CO₂ tons per year"
}
}
}
};

return (

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

<h2 className="text-lg font-bold mb-4">
Carbon Emission Comparison
</h2>

<Bar data={data} options={options} />

<p className="text-sm text-gray-500 mt-4">
Data Sources: Global Carbon Project, IEA, Government Climate Reports
</p>

</div>

);

}