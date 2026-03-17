import { FaLeaf, FaBus, FaBolt, FaPlane } from "react-icons/fa";

export default function CarbonSuggestions({ total = 3950 }) {

const suggestions = [];

if (total > 3000) {
  suggestions.push({
    icon: <FaBus />,
    text: "Use public transport more often to reduce travel emissions."
  });
}

if (total > 2500) {
  suggestions.push({
    icon: <FaBolt />,
    text: "Switch to renewable electricity or reduce power usage."
  });
}

if (total > 2000) {
  suggestions.push({
    icon: <FaPlane />,
    text: "Reduce air travel or choose eco-friendly airlines."
  });
}

suggestions.push({
  icon: <FaLeaf />,
  text: "Adopt more plant-based meals to reduce food emissions."
});

return (

<div className="glass-card">

<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
🌱 Carbon Reduction Suggestions
</h2>

<p className="text-gray-500 mb-4">
Your emissions are higher than the recommended sustainable level.
Here are some ways to reduce them:
</p>

<div className="space-y-3">

{suggestions.map((s, i) => (

<div
key={i}
className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-3 rounded"
>

<div className="text-green-600 text-lg">
{s.icon}
</div>

<p className="text-sm">
{s.text}
</p>

</div>

))}

</div>

</div>

);

}