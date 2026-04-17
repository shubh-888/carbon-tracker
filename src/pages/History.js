import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

import Layout from "../components/Layout";
import { motion } from "framer-motion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function History(){

const [data,setData] = useState([]);
const [search,setSearch] = useState("");
const [filter,setFilter] = useState("all");


/* ================= FETCH DATA ================= */

useEffect(()=>{

if(!auth.currentUser) return;

const q = query(
collection(db,"emissions"),
where("userId","==",auth.currentUser.uid)
);

const unsubscribe = onSnapshot(q,(snapshot)=>{

let arr = [];

snapshot.forEach(doc=>{
arr.push(doc.data());
});

arr.sort((a,b)=>b.date?.seconds - a.date?.seconds);

setData(arr);

});

return ()=>unsubscribe();

},[]);


/* ================= PDF ================= */

const downloadPDF = () => {

const doc = new jsPDF();

doc.setFillColor(34,197,94);
doc.rect(0,0,210,20,"F");

doc.setTextColor(255,255,255);
doc.setFontSize(16);
doc.text("EcoTrack Carbon Report", 15, 12);

doc.setTextColor(0,0,0);

doc.text(
`Generated on: ${new Date().toLocaleDateString()}`,
14,
26
);

doc.text(
`User: ${auth.currentUser?.email || "User"}`,
14,
34
);

let total = data.reduce((sum,e)=>sum+e.total,0);
let avg = data.length ? total/data.length : 0;

doc.text(`Average Emission: ${avg.toFixed(2)} kg`,14,44);
doc.text(`Total Records: ${data.length}`,14,50);

const tableData = data.map((item,i)=>{

const date =
new Date(item.date.seconds * 1000)
.toLocaleDateString();

const status = item.total < 400 ? "Good" : "High";

return [
i+1,
date,
item.total.toFixed(2) + " kg",
status
];

});

autoTable(doc,{
startY: 60,
head: [["#", "Date", "Emission", "Status"]],
body: tableData,
theme: "grid",
styles: { fontSize: 10 },
headStyles: { fillColor: [34,197,94] }
});

doc.save("EcoTrack_Report.pdf");

};


/* ================= FILTER ================= */

const filtered = data.filter(item=>{

const dateStr =
new Date(item.date.seconds * 1000)
.toLocaleDateString();

const matchSearch = dateStr.includes(search);

const status = item.total < 400 ? "good" : "high";

const matchFilter =
filter === "all" || filter === status;

return matchSearch && matchFilter;

});


return(

<Layout>

<div className="w-full px-4 md:px-8 py-6 space-y-6">

{/* HEADER */}

<div className="flex flex-col md:flex-row justify-between gap-4 items-center">

<h1 className="text-2xl md:text-3xl font-bold text-green-600">
📊 Emission History
</h1>

<button
onClick={downloadPDF}
className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
>
Download PDF
</button>

</div>


{/* FILTERS */}

<div className="flex flex-wrap gap-4">

<input
placeholder="Search by date..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="p-2 rounded border 
bg-white dark:bg-gray-800 
text-black dark:text-white"
/>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
className="p-2 rounded border 
bg-white dark:bg-gray-800 
text-black dark:text-white"
>

<option value="all">All</option>
<option value="good">Good</option>
<option value="high">High</option>

</select>

</div>


{/* EMPTY STATE */}

{filtered.length === 0 && (

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">

<p className="text-gray-500">
No emission records found.
</p>

</div>

)}


{/* TABLE */}

{filtered.length > 0 && (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="rounded-2xl shadow overflow-x-auto 
bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg"
>

<table className="min-w-full">

<thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">

<tr className="text-left text-sm">

<th className="p-4">Date</th>
<th>Total Emission</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((item,i)=>{

const date =
new Date(item.date.seconds * 1000)
.toLocaleDateString();

const status =
item.total < 400 ? "Good" : "High";

return(

<tr
key={i}
className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition"
>

<td className="p-4">{date}</td>

<td className="font-medium text-gray-800 dark:text-gray-200">
{item.total.toFixed(2)} kg
</td>

<td>

<span className={`px-3 py-1 rounded text-white text-sm
${status==="Good"
? "bg-green-500"
: "bg-red-500"}`}>

{status}

</span>

</td>

</tr>

);

})}

</tbody>

</table>

</motion.div>

)}

</div>

</Layout>

);
}