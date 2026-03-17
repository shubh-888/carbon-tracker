import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import HistoryReport from "../components/HistoryReport";

export default function History(){

const [data,setData] = useState([]);

useEffect(()=>{

const q = query(
collection(db,"emissions"),
where("userId","==",auth.currentUser.uid)
);

const unsubscribe = onSnapshot(q,(snapshot)=>{

let arr = [];

snapshot.forEach(doc=>{
arr.push({
id:doc.id,
...doc.data()
});
});

setData(arr);

});

return ()=>unsubscribe();

},[]);

return(

<div className="glass-card">

<div className="flex justify-between items-center mb-6">

<h2 className="text-xl font-bold">
Emission History
</h2>

<HistoryReport data={data}/>

</div>

<table className="w-full text-left">

<thead className="border-b">

<tr>
<th className="py-2">Date</th>
<th>Total Emissions</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{data.map((item,i)=>{

const status =
item.total < 2500
? "Good"
: item.total < 3500
? "Average"
: "High";

return(

<tr key={i} className="border-b">

<td className="py-2">
{new Date(item.date.seconds * 1000).toLocaleDateString()}
</td>

<td>
{item.total} kg
</td>

<td>

<span
className={`px-2 py-1 rounded text-xs text-white
${status==="Good" ? "bg-green-500" :
status==="Average" ? "bg-yellow-500" :
"bg-red-500"}
`}
>

{status}

</span>

</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}