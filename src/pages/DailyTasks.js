import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BadgeUnlock from "../components/BadgeUnlock";
import Layout from "../components/Layout";
import { db, auth } from "../firebase/firebaseConfig";

import {
collection,
doc,
setDoc,
getDoc,
onSnapshot,
query,
where,
getDocs
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";

export default function DailyTasks() {

const [tasks,setTasks] = useState([]);
const [completed,setCompleted] = useState({});
const [userData,setUserData] = useState(null);
const [user,setUser] = useState(null);
const [loading,setLoading] = useState(true);
const [newBadge,setNewBadge] = useState(null);

const todayKey = new Date().toISOString().split("T")[0];

useEffect(()=>{
const unsub = onAuthStateChanged(auth,(u)=>{
if(u){
setUser(u);
setLoading(false);
}
});
return ()=>unsub();
},[]);

useEffect(()=>{
if(!user) return;

const unsub = onSnapshot(collection(db,"tasks"),(snapshot)=>{
let arr=[];
snapshot.forEach(doc=>{
arr.push({id:doc.id,...doc.data()});
});
setTasks(arr);
});

return ()=>unsub();

},[user]);

useEffect(()=>{

if(!user) return;

const loadUser = async()=>{

const ref = doc(db,"users",user.uid);
const snap = await getDoc(ref);

if(!snap.exists()){

await setDoc(ref,{
points:0,
streak:0,
badges:[],
lastTaskDate:null
});

setUserData({
points:0,
streak:0,
badges:[]
});

}else{
setUserData(snap.data());
}

};

loadUser();

},[user]);

useEffect(()=>{

if(!user) return;

const loadCompleted = async()=>{

const q = query(
collection(db,"userTasks"),
where("userId","==",user.uid),
where("date","==",todayKey)
);

const snap = await getDocs(q);

let map={};

snap.forEach(d=>{
map[d.data().taskId]=true;
});

setCompleted(map);

};

loadCompleted();

},[user]);

const completeTask = async(task)=>{

if(completed[task.id]) return;

const uid = auth.currentUser.uid;
const id = `${uid}_${task.id}_${todayKey}`;

await setDoc(doc(db,"userTasks",id),{
userId:uid,
taskId:task.id,
date:todayKey,
completed:true
});

toast.success(`+${task.points} XP 🚀`);

setCompleted(prev=>({...prev,[task.id]:true}));

};

if(loading){

return(

<Layout>

<div className="flex items-center justify-center min-h-screen dark:text-white">
Loading tasks...
</div>

</Layout>

);

}

return(

<Layout>

<div className="w-full px-4 md:px-8 py-6 space-y-6">

<h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
🌱 Daily Sustainability Tasks
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{tasks.map(task=>(

<motion.div
key={task.id}
whileHover={{scale:1.04}}
className="bg-white dark:bg-gray-800
p-5 rounded-2xl shadow
flex justify-between items-center"
>

<div>

<h3 className="font-semibold text-lg">
{task.title}
</h3>

<p className="text-sm text-gray-500">
+{task.points} XP
</p>

</div>

<button
onClick={()=>completeTask(task)}
disabled={completed[task.id]}
className={`px-4 py-2 rounded-xl transition font-medium

${completed[task.id]
? "bg-gray-400 cursor-not-allowed"
: "bg-green-600 hover:bg-green-700 text-white"}

`}
>

{completed[task.id] ? "Done ✅" : "Complete"}

</button>

</motion.div>

))}

</div>

{newBadge && <BadgeUnlock badge={newBadge} />}

</div>

</Layout>

);
}