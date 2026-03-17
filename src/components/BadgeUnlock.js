import { motion } from "framer-motion";

export default function BadgeUnlock({ badge }) {

if(!badge) return null;

return (

<motion.div
initial={{ scale:0 }}
animate={{ scale:1 }}
transition={{ duration:0.4 }}
className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg"
>

🎉 New Badge Earned

<div className="font-bold mt-1">
{badge}
</div>

</motion.div>

);

}