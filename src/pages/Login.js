import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/firebaseConfig";

import {
signInWithEmailAndPassword,
signInWithPopup,
GoogleAuthProvider,
signOut
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import toast from "react-hot-toast";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

const navigate = useNavigate();

const provider = new GoogleAuthProvider();

/* AUTO REDIRECT */

useEffect(()=>{

const checkUser = async()=>{

if(auth.currentUser){

await auth.currentUser.reload();

if(auth.currentUser.emailVerified){
navigate("/");
}

}

};

checkUser();

},[navigate]);


/* EMAIL LOGIN */

const handleLogin = async(e)=>{

e.preventDefault();

if(!email.trim() || !password.trim()){
toast.error("Fill all fields");
return;
}

try{

setLoading(true);

const userCredential =
await signInWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

if(!user.emailVerified){

toast.error("Please verify your email first");

await signOut(auth);

return;

}

toast.success("Login successful 🎉");

navigate("/");

}catch(error){

if(error.code==="auth/user-not-found"){
toast.error("Email not registered");
}
else if(error.code==="auth/wrong-password"){
toast.error("Wrong password");
}
else if(error.code==="auth/invalid-email"){
toast.error("Invalid email");
}
else{
toast.error("Login failed");
}

}
finally{
setLoading(false);
}

};


/* GOOGLE LOGIN */

const handleGoogleLogin = async()=>{

try{

setLoading(true);

const result = await signInWithPopup(auth,provider);

const user = result.user;

/* CREATE PROFILE IF NOT EXISTS */

await setDoc(doc(db,"users",user.uid),{

name:user.displayName || "User",
email:user.email,
points:0,
streak:0,
badges:[]

},{merge:true});

toast.success("Google login successful 🚀");

navigate("/");

}catch(error){

console.log(error);
toast.error("Google login failed");

}
finally{
setLoading(false);
}

};


return(

<div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">

<form
onSubmit={handleLogin}
className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-xl w-full max-w-md space-y-4"
>

<h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
Login
</h2>


<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-3 border rounded
bg-gray-50 dark:bg-gray-900
text-black dark:text-white"
/>


<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-3 border rounded
bg-gray-50 dark:bg-gray-900
text-black dark:text-white"
/>


<button
disabled={loading}
className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
>

{loading ? "Logging in..." : "Login"}

</button>


<p
className="text-sm text-right text-green-600 cursor-pointer"
onClick={()=>navigate("/reset-password")}
>

Forgot Password?

</p>


<div className="text-center text-gray-400 text-sm">
──────── OR ────────
</div>


<button
type="button"
onClick={handleGoogleLogin}
className="w-full border p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
alt="google"
className="w-5 h-5"
/>

Continue with Google

</button>


<p className="text-center text-sm text-gray-600 dark:text-gray-300">

Don't have an account?{" "}

<span
className="text-green-600 cursor-pointer"
onClick={()=>navigate("/register")}
>

Register

</span>

</p>

</form>

</div>

);

}