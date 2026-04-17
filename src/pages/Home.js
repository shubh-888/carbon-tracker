import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import CountUp from "react-countup";

import {
FaChartBar,
FaTrophy,
FaRobot,
FaCamera,
FaBolt,
FaUsers,
FaLeaf,
FaBullseye,
FaStar
} from "react-icons/fa";

export default function Home(){

const navigate = useNavigate();
const { user } = useAuth();

const features = [
{
icon:<FaChartBar/>,
tag:"Core Feature",
title:"Real-Time Tracking",
desc:"Monitor emissions across transport, electricity, food, and waste with interactive charts."
},
{
icon:<FaTrophy/>,
tag:"Popular",
title:"Gamification & Leaderboards",
desc:"Earn badges and compete globally while reducing emissions."
},
{
icon:<FaRobot/>,
tag:"AI Powered",
title:"AI-Powered Chatbot",
desc:"Ask sustainability questions and receive instant AI insights."
},
{
icon:<FaCamera/>,
tag:"AI Powered",
title:"Image-Based Estimation",
desc:"Upload receipts to estimate carbon emissions automatically."
},
{
icon:<FaStar/>,
tag:"AI Powered",
title:"Natural Language Insights",
desc:"AI summaries explaining your carbon data clearly."
},
{
icon:<FaUsers/>,
tag:"Enterprise",
title:"Multi-Level Tracking",
desc:"Track emissions for individuals, organizations, or cities."
},
{
icon:<FaBullseye/>,
tag:"Engaging",
title:"Daily Quest System",
desc:"Complete sustainability challenges and earn achievements."
},
{
icon:<FaBolt/>,
tag:"New",
title:"Rewards Shop",
desc:"Spend quest points on avatars and rewards."
},
{
icon:<FaLeaf/>,
tag:"Impact",
title:"Tree Planting Tracker",
desc:"Convert carbon reduction into tree equivalents."
}
];

return(

<div className="w-full min-h-screen text-gray-900 dark:text-white">

{/* HERO — FULL WIDTH */}

<section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6">

<motion.h1
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.6}}
className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl"
>
Track & Reduce Your <br/>
<span className="text-green-600">Carbon Footprint</span>
</motion.h1>

<motion.p
initial={{opacity:0}}
animate={{opacity:1}}
transition={{delay:0.3}}
className="text-gray-600 dark:text-gray-300 mt-6 max-w-2xl"
>
The intelligent platform for individuals and organizations to measure,
analyze and reduce environmental impact.
</motion.p>

<div className="flex gap-4 mt-8">

<button
onClick={()=>navigate(user?"/dashboard":"/login")}
className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition"
>
{user ? "Go to Dashboard →" : "Get Started 🚀"}
</button>

<button
onClick={()=>navigate("/calculator")}
className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
>
Try Calculator
</button>

</div>

</section>


{/* STATS — CENTERED */}

<section className="w-full py-20">

<div className="max-w-6xl mx-auto text-center px-6">

<div className="grid md:grid-cols-4 gap-10">

<div>
<h3 className="text-4xl font-bold text-green-600">
<CountUp end={50000} duration={2}/>+
</h3>
<p className="text-gray-600 dark:text-gray-400">Active Users</p>
</div>

<div>
<h3 className="text-4xl font-bold text-green-600">
<CountUp end={2500000} duration={2}/> kg
</h3>
<p className="text-gray-600 dark:text-gray-400">CO₂ Reduced</p>
</div>

<div>
<h3 className="text-4xl font-bold text-green-600">
<CountUp end={120000} duration={2}/>
</h3>
<p className="text-gray-600 dark:text-gray-400">Trees Equivalent</p>
</div>

<div>
<h3 className="text-4xl font-bold text-green-600">
95%
</h3>
<p className="text-gray-600 dark:text-gray-400">User Success Rate</p>
</div>

</div>

</div>

</section>


{/* FEATURES — CENTERED */}

<section className="w-full py-24">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-4xl font-bold text-center mb-16">
Powerful Features for Climate Action
</h2>

<div className="grid md:grid-cols-3 gap-8">

{features.map((f,i)=>(

<motion.div
key={i}
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{delay:i*0.05}}
whileHover={{scale:1.04}}
className="relative bg-white dark:bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-green-500 transition"
>

<span className="absolute top-4 right-4 text-xs bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full">
{f.tag}
</span>

<div className="text-green-600 text-2xl mb-4">
{f.icon}
</div>

<h3 className="font-semibold text-lg mb-2">
{f.title}
</h3>

<p className="text-sm text-gray-600 dark:text-gray-300">
{f.desc}
</p>

</motion.div>

))}

</div>

</div>

</section>


{/* HOW IT WORKS — CENTERED */}

<section className="w-full py-24">

<div className="max-w-6xl mx-auto text-center px-6">

<h2 className="text-4xl font-bold mb-14">
How CarbonTrack Works
</h2>

<div className="grid md:grid-cols-4 gap-10">

{[
{num:"1",title:"Sign Up"},
{num:"2",title:"Track"},
{num:"3",title:"Analyze"},
{num:"4",title:"Reduce"}
].map((item,i)=>(

<motion.div
key={i}
initial={{opacity:0,y:30}}
whileInView={{opacity:1,y:0}}
transition={{delay:i*0.1}}
>

<div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
{item.num}
</div>

<h3 className="font-semibold">{item.title}</h3>

</motion.div>

))}

</div>

</div>

</section>


{/* CTA — FULL WIDTH */}

<section className="w-full py-24 bg-gradient-to-r from-green-600 to-emerald-500 text-white">

<div className="max-w-6xl mx-auto text-center px-6">

<h2 className="text-4xl font-bold mb-6">
Ready to Make a Difference?
</h2>

<button
onClick={()=>navigate(user?"/dashboard":"/register")}
className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold shadow hover:scale-105 transition"
>
{user ? "Go to Dashboard ⚡" : "Join Now →"}
</button>

</div>

</section>


{/* FOOTER — FULL WIDTH */}

<footer className="w-full border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-500 dark:text-gray-400">
© 2026 CarbonTrack. Making the world more sustainable.
</footer>

</div>

);
}