import { useEffect,useState } from "react";
import { db } from "../firebase/firebaseConfig";

import {
collection,
query,
orderBy,
limit,
getDocs,
doc,
getDoc
} from "firebase/firestore";

export default function Leaderboard(){

const [data,setData] = useState([]);

useEffect(()=>{

const fetchLeaderboard = async ()=>{

const q = query(
collection(db,"emissions"),
orderBy("total"),
limit(10)
);

const snapshot = await getDocs(q);

let arr = [];

for(const document of snapshot.docs){

const emission = document.data();

const userRef = doc(db,"users",emission.userId);
const userSnap = await getDoc(userRef);

let userData = {};

if(userSnap.exists()){
userData = userSnap.data();
}

arr.push({
...emission,
name:userData.name || "User",
avatar:userData.avatar || ""
});

}

setData(arr);

};

fetchLeaderboard();

},[]);

return(

<div className="bg-white dark:bg-gray-800 p-6 rounded shadow">

<h2 className="text-xl font-bold mb-6">
Eco Leaderboard
</h2>

<table className="w-full">

<thead className="border-b">

<tr>

<th>Rank</th>
<th>User</th>
<th>Emission</th>

</tr>

</thead>

<tbody>

{data.map((item,i)=>(

<tr key={i} className="border-b">

<td>#{i+1}</td>

<td className="flex items-center gap-3">

<img
src={
item.avatar ||
`https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`
}
alt="User Avatar"
className="w-8 h-8 rounded-full"
/>

<span>{item.name}</span>

</td>

<td>{item.total.toFixed(2)} kg</td>

</tr>

))}

</tbody>

</table>

</div>

)

}