import { motion } from "framer-motion";
import { FaLeaf, FaCar, FaPlane } from "react-icons/fa";

export default function StatsCards(){

const cards = [
{icon:<FaLeaf/>,title:"Electricity",value:"950 kg"},
{icon:<FaCar/>,title:"Transport",value:"1100 kg"},
{icon:<FaPlane/>,title:"Flights",value:"900 kg"},
];

return(

<div className="grid md:grid-cols-3 gap-6">

{cards.map((card,i)=>(

<motion.div
key={i}
whileHover={{scale:1.05}}
className="glass-card flex items-center gap-4"
>

<div className="text-2xl text-green-600">
{card.icon}
</div>

<div>
<p className="text-gray-500 text-sm">
{card.title}
</p>

<h3 className="font-bold text-lg">
{card.value}
</h3>
</div>

</motion.div>

))}

</div>

)

}