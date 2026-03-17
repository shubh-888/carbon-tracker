import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
LineElement,
PointElement,
CategoryScale,
LinearScale,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
LineElement,
PointElement,
CategoryScale,
LinearScale,
Tooltip,
Legend
);

export default function TrendChart({emissions}){

const labels = emissions.map(e =>
new Date(e.date.seconds * 1000).toLocaleDateString()
);

const values = emissions.map(e => e.total);

const data = {

labels: labels,

datasets:[
{
label:"Carbon Emissions",
data: values,
borderColor:"#22c55e",
backgroundColor:"rgba(34,197,94,0.2)",
tension:0.4
}
]

};

return <Line data={data}/>;

}