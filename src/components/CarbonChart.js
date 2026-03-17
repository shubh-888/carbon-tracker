import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
BarElement,
CategoryScale,
LinearScale,
Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function CarbonChart(){

const data = {
labels:["Home","Travel","Flights","Food"],
datasets:[
{
label:"Emissions",
data:[950,1100,900,300],
backgroundColor:"#22c55e"
}
]
};

return <Bar data={data} />;
}