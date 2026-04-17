import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotificationBell(){

const [notifications,setNotifications] = useState([]);
const [open,setOpen] = useState(false);

/* 🔥 REAL-TIME FETCH */
useEffect(()=>{

  if(!auth.currentUser) return;

  const q = query(
    collection(db,"notifications"),
    where("userId","==",auth.currentUser.uid)
  );

  const unsub = onSnapshot(q,(snap)=>{
    let arr=[];
    snap.forEach(d=>{
      arr.push({id:d.id,...d.data()});
    });

    // latest first
    arr.sort((a,b)=>b.createdAt?.seconds - a.createdAt?.seconds);

    setNotifications(arr);
  });

  return ()=>unsub();

},[]);

/* 🔥 UNREAD COUNT */
const unread = notifications.filter(n=>!n.read).length;

/* 🔥 MARK AS READ */
const markRead = async(id)=>{
  await updateDoc(doc(db,"notifications",id),{
    read:true
  });
};

return(

<div className="relative">

{/* 🔔 ICON */}
<div onClick={()=>setOpen(!open)}
className="cursor-pointer relative">

<FaBell size={20}/>

{/* 🔴 BADGE */}
{unread > 0 && (
<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
{unread}
</span>
)}

</div>

{/* 🔽 DROPDOWN */}
{open && (

<motion.div
initial={{opacity:0, y:10}}
animate={{opacity:1, y:0}}
className="absolute right-0 mt-3 w-72 bg-white shadow-xl rounded-xl p-3 z-50"
>

<h3 className="font-semibold mb-2">Notifications</h3>

{notifications.length === 0 ? (
<p className="text-gray-500 text-sm">No notifications</p>
) : (

notifications.map(n=>(
<div
key={n.id}
onClick={()=>markRead(n.id)}
className={`p-2 rounded cursor-pointer mb-2 ${
n.read ? "bg-gray-100" : "bg-green-100"
}`}
>

<p className="text-sm">{n.text}</p>

<p className="text-xs text-gray-500">
{n.createdAt?.seconds
? new Date(n.createdAt.seconds*1000).toLocaleString()
: ""}
</p>

</div>
))

)}

</motion.div>

)}

</div>

);
}