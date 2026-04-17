import { useMemo } from "react";

export default function AnimatedBackground(){

const leaves = useMemo(()=>{
  return [...Array(30)].map(()=>({
    top: Math.random()*100,
    left: Math.random()*100,
    size: Math.random()*25 + 15,
    duration: Math.random()*10 + 10,
    delay: Math.random()*5
  }));
},[]);

return(

<div className="fixed inset-0 -z-10 pointer-events-none 
bg-gradient-to-br from-green-50 via-white to-green-100
dark:from-gray-900 dark:via-black dark:to-gray-900">

{leaves.map((leaf,i)=>(

<div
key={i}
className="absolute text-green-400 dark:text-green-600 opacity-20"
style={{
top:`${leaf.top}%`,
left:`${leaf.left}%`,
fontSize:`${leaf.size}px`,
animation:`float ${leaf.duration}s ease-in-out infinite`,
animationDelay:`${leaf.delay}s`
}}
>
🍃
</div>

))}

</div>

);
}