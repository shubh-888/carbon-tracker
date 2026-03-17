import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BadgeUnlock from "../components/BadgeUnlock";
import { db, auth } from "../firebase/firebaseConfig";
import {
collection,
getDocs,
doc,
setDoc,
getDoc,
updateDoc
} from "firebase/firestore";

export default function DailyTasks(){

const [tasks,setTasks] = useState([]);
const [earnedBadge,setEarnedBadge] = useState(null);
const user = auth.currentUser;

useEffect(()=>{

async function loadTasks(){

const snapshot = await getDocs(collection(db,"tasks"));

let arr = [];

snapshot.forEach(doc=>{
arr.push({id:doc.id,...doc.data()});
});

setTasks(arr);

}

loadTasks();

},[]);

const completeTask = async(task)=>{

  

const taskRef = doc(db,"userTasks",user.uid+"_"+task.id);


const taskSnap = await getDoc(taskRef);

if(taskSnap.exists()){
toast.error("Task already completed today");
return;
}
await setDoc(taskRef,{
userId:user.uid,
taskId:task.id,
completed:true
});

/* Update points */

const userRef = doc(db,"users",user.uid);
const userSnap = await getDoc(userRef);

let userData = userSnap.data();

let newPoints = (userData.points || 0) + task.points;

let newBadges = userData.badges || [];

if(!newBadges.includes(task.badge)){
newBadges.push(task.badge);
}

await updateDoc(userRef,{
points:newPoints,
badges:newBadges
});

setEarnedBadge(task.badge);
toast.success("Task completed!");

};

return(

<div className="max-w-3xl mx-auto space-y-6">

<h1 className="text-2xl font-bold">
Daily Eco Tasks
</h1>

{tasks.map(task=>(

<div
key={task.id}
className="bg-white dark:bg-gray-800 p-6 rounded shadow flex justify-between"
>

<div>

<h3 className="font-semibold">
{task.title}
</h3>

<p className="text-sm text-gray-500">
Reward: {task.points} points
</p>

</div>

<button
onClick={()=>completeTask(task)}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Complete
</button>

</div>

))}

{/* Badge animation */}
<BadgeUnlock badge={earnedBadge} />

</div>

)
}