import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { FaLeaf, FaChartLine, FaGlobe } from "react-icons/fa";

export default function Home(){

const navigate = useNavigate();

const handleStart = () => {

if(auth.currentUser){
navigate("/calculator");
}else{
navigate("/login");
}

};

return(

<div className="space-y-16">

{/* HERO SECTION */}

<div className="bg-gradient-to-r from-green-700 to-green-500 text-white rounded-xl p-12 flex flex-col md:flex-row items-center justify-between">

<div className="max-w-xl">

<h1 className="text-4xl md:text-5xl font-bold mb-4">
Track Your Carbon Footprint
</h1>

<p className="text-green-100 mb-6">
Understand your environmental impact and take steps
toward a sustainable future.
</p>

<button
onClick={handleStart}
className="bg-white text-green-700 px-6 py-3 rounded font-semibold hover:bg-gray-200"
>
Start Calculation
</button>

</div>

 <img
src="https://cdn-icons-png.flaticon.com/512/414/414927.png"
alt=""
className="w-56 mt-8 md:mt-0"
/> 

</div>

{/* FEATURES */}

<div>

<h2 className="text-3xl font-bold text-center mb-10">
How EcoTrack Helps You
</h2>

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">

<FaLeaf className="text-green-600 text-3xl mx-auto mb-4"/>

<h3 className="font-semibold mb-2">
Track Carbon Emissions
</h3>

<p className="text-gray-500 text-sm">
Calculate emissions from electricity,
travel, and lifestyle choices.
</p>

</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">

<FaChartLine className="text-blue-600 text-3xl mx-auto mb-4"/>

<h3 className="font-semibold mb-2">
Analytics Dashboard
</h3>

<p className="text-gray-500 text-sm">
Visualize your carbon trends
with real-time charts.
</p>

</div>

<div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">

<FaGlobe className="text-green-700 text-3xl mx-auto mb-4"/>

<h3 className="font-semibold mb-2">
Eco Leaderboard
</h3>

<p className="text-gray-500 text-sm">
Compare your footprint
with other eco-conscious users.
</p>

</div>

</div>

</div>

{/* ECO STATS */}

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-green-600 text-white p-8 rounded text-center">

<h3 className="text-3xl font-bold">
1M+
</h3>

<p>
CO₂ emissions tracked
</p>

</div>

<div className="bg-green-700 text-white p-8 rounded text-center">

<h3 className="text-3xl font-bold">
10K+
</h3>

<p>
Eco conscious users
</p>

</div>

<div className="bg-green-800 text-white p-8 rounded text-center">

<h3 className="text-3xl font-bold">
500+
</h3>

<p>
Tons CO₂ reduced
</p>

</div>

</div>

{/* CALL TO ACTION */}

<div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow text-center">

<h2 className="text-2xl font-bold mb-4">
Start Your Sustainability Journey
</h2>

<p className="text-gray-500 mb-6">
Measure your carbon footprint and make smarter
environmental decisions today.
</p>

<button
onClick={handleStart}
className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700"
>
Calculate My Carbon Footprint
</button>

</div>

</div>

)

}