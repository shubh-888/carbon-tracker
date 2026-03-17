import { useEffect, useState } from "react";

export default function ThemeToggle(){

const [dark,setDark] = useState(false);

useEffect(()=>{

const theme = localStorage.getItem("theme");

if(theme==="dark"){
document.documentElement.classList.add("dark");
setDark(true);
}

},[])

function toggleTheme(){

if(dark){

document.documentElement.classList.remove("dark");
localStorage.setItem("theme","light");

}else{

document.documentElement.classList.add("dark");
localStorage.setItem("theme","dark");

}

setDark(!dark);

}

return(

<button
onClick={toggleTheme}
className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
>

{dark ? "☀" : "🌙"}

</button>

)

}