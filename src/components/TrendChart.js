import { Line } from "react-chartjs-2";

import {
Chart as ChartJS,
LineElement,
PointElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
Filler
} from "chart.js";

ChartJS.register(
LineElement,
PointElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
Filler
);

export default function TrendChart({ emissions }){

const labels = emissions.map(e =>
new Date(e.date.seconds * 1000).toLocaleDateString()
);

const values = emissions.map(e => e.total);

const data = {

labels,

datasets:[
{
label:"Carbon Emissions",
data:values,
borderColor:"#22c55e",
backgroundColor:"rgba(34,197,94,0.15)",
fill:true,
tension:0.4,
pointRadius:4,
pointBackgroundColor:"#22c55e",
pointHoverRadius:6
}
]

};

const options = {

responsive:true,
maintainAspectRatio:false,

animation:{
duration:1500,
easing:"easeInOutQuart"
},

plugins:{
legend:{
display:true,
position:"top"
},
tooltip:{
backgroundColor:"#111827",
titleColor:"#fff",
bodyColor:"#fff"
}
},

layout:{
padding:10
},

scales:{

x:{
ticks:{
maxRotation:25,
minRotation:25
},
grid:{
display:false
}
},

y:{
ticks:{
color:"#6b7280"
},
grid:{
color:"rgba(0,0,0,0.06)"
}
}

}

};

return(

<div className="w-full h-[320px] md:h-[450px]">

<Line
data={data}
options={options}
/>

</div>

);

}