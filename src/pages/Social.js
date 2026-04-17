import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import {
collection,
addDoc,
onSnapshot,
Timestamp,
doc,
updateDoc,
arrayUnion,
arrayRemove,
query,
orderBy
} from "firebase/firestore";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function Social(){

const [posts,setPosts] = useState([]);
const [text,setText] = useState("");
const [comments,setComments] = useState({});
const [loading,setLoading] = useState(true);


/* REALTIME POSTS */

useEffect(()=>{

const q=query(
collection(db,"posts"),
orderBy("createdAt","desc")
);

const unsub=onSnapshot(q,(snap)=>{

let arr=[];

snap.forEach(d=>{
arr.push({id:d.id,...d.data()});
});

setPosts(arr);
setLoading(false);

});

return()=>unsub();

},[]);


/* CREATE POST */

const handlePost=async()=>{

if(!text.trim()) return;

if(!auth.currentUser){
alert("Login required");
return;
}

try{

await addDoc(collection(db,"posts"),{

userId:auth.currentUser.uid,
name:auth.currentUser.email,
text:text.trim(),
likes:[],
comments:[],
createdAt:Timestamp.now()

});

setText("");

}catch(err){

console.log(err);

}

};


/* LIKE / UNLIKE */

const handleLike=async(post)=>{

if(!auth.currentUser) return;

const uid=auth.currentUser.uid;

const ref=doc(db,"posts",post.id);

try{

if(post.likes?.includes(uid)){

await updateDoc(ref,{
likes:arrayRemove(uid)
});

}else{

await updateDoc(ref,{
likes:arrayUnion(uid)
});

}

}catch(err){

console.log(err);

}

};


/* COMMENT */

const handleComment=async(post)=>{

if(!auth.currentUser) return;

const value=comments[post.id];

if(!value || !value.trim()) return;

try{

const ref=doc(db,"posts",post.id);

await updateDoc(ref,{

comments:arrayUnion({
user:auth.currentUser.email,
text:value.trim(),
time:Timestamp.now()
})

});

setComments(prev=>({
...prev,
[post.id]:""
}));

}catch(err){

console.log(err);

}

};


return(

<div className="w-full min-h-screen px-4 md:px-8 py-6 max-w-4xl mx-auto space-y-6">

{/* HEADER */}

<h1 className="text-2xl md:text-3xl font-bold text-green-600">
🌍 Community Feed
</h1>


{/* POST BOX */}

<div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-5 rounded-xl shadow">

<textarea
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Share an eco tip or thought 🌱..."
className="w-full p-3 rounded-lg border
bg-gray-50 dark:bg-gray-900
text-black dark:text-white"
/>

<button
onClick={handlePost}
className="bg-green-600 text-white px-5 py-2 mt-3 rounded-lg hover:bg-green-700 transition"
>
Post
</button>

</div>


{/* LOADING */}

{loading &&(

<p className="text-center text-gray-500">
Loading posts...
</p>

)}


{/* EMPTY STATE */}

{!loading && posts.length===0 &&(

<p className="text-center text-gray-500">
No posts yet
</p>

)}


{/* POSTS */}

{posts.map(post=>{

const liked=post.likes?.includes(auth.currentUser?.uid);

return(

<motion.div
key={post.id}
initial={{opacity:0}}
animate={{opacity:1}}
className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-5 rounded-xl shadow"
>

{/* USER */}

<div className="flex items-center gap-3 mb-2">

<div className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full">

{post.name?.slice(0,1).toUpperCase()}

</div>

<div>

<p className="text-sm font-semibold">
{post.name}
</p>

<p className="text-xs text-gray-500">

{post.createdAt &&
formatDistanceToNow(post.createdAt.toDate())} ago

</p>

</div>

</div>


{/* TEXT */}

<p className="mb-4 text-gray-800 dark:text-gray-200">
{post.text}
</p>


{/* ACTIONS */}

<div className="flex items-center gap-6 mb-3 text-sm">

<button
onClick={()=>handleLike(post)}
className={`transition hover:scale-110
${liked ? "text-red-500" : "text-gray-400"}`}
>

❤️ {post.likes?.length || 0}

</button>

</div>


{/* COMMENTS */}

{post.comments?.map((c,i)=>(

<div
key={i}
className="text-sm text-gray-700 dark:text-gray-300 mb-1"
>

<b>{c.user}</b>: {c.text}

</div>

))}


{/* COMMENT BOX */}

<div className="flex gap-2 mt-3">

<input
value={comments[post.id] || ""}
onChange={(e)=>setComments({
...comments,
[post.id]:e.target.value
})}

placeholder="Write a comment..."

className="flex-1 p-2 rounded border
bg-gray-50 dark:bg-gray-900
text-black dark:text-white"
/>

<button
onClick={()=>handleComment(post)}
className="bg-green-600 text-white px-4 rounded"
>
Send
</button>

</div>

</motion.div>

);

})}

</div>

);

}