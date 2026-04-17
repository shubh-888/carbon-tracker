import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";

import {
createUserWithEmailAndPassword,
sendEmailVerification
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);
const [emailSent,setEmailSent] = useState(false);

const navigate = useNavigate();

const handleRegister = async(e)=>{

e.preventDefault();

if(!name || !email || !password){
toast.error("Please fill all fields");
return;
}

if(password.length < 6){
toast.error("Password must be at least 6 characters");
return;
}

try{

setLoading(true);

/* CREATE USER */

const userCredential =
await createUserWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

/* SEND VERIFICATION EMAIL */

await sendEmailVerification(user);

/* SAVE USER DATA */

await setDoc(doc(db,"users",user.uid),{
name,
email,
points:0,
avatar:`https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
createdAt: serverTimestamp()
});

/* SHOW EMAIL SCREEN */

setEmailSent(true);

toast.success("Verification email sent!");

}catch(error){

toast.error(error.message || "Registration failed");

}
finally{
setLoading(false);
}

};

return(

<div className="min-h-screen flex items-center justify-center 
bg-gray-50 dark:bg-gray-900 px-4">

<div className="bg-white dark:bg-gray-800 
shadow-xl p-6 md:p-8 rounded-2xl 
w-full max-w-md">

{/* REGISTER FORM */}

{!emailSent && (

<form onSubmit={handleRegister} className="space-y-4">

<h2 className="text-2xl md:text-3xl font-bold text-center text-green-600">

Create Account 🌱

</h2>

<p className="text-center text-gray-500 dark:text-gray-400 text-sm">

Join EcoTrack and start tracking your carbon footprint

</p>

<input
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full p-3 border rounded-lg
bg-white dark:bg-gray-700
dark:border-gray-600
dark:text-white
focus:outline-none focus:ring-2 focus:ring-green-500"
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-3 border rounded-lg
bg-white dark:bg-gray-700
dark:border-gray-600
dark:text-white
focus:outline-none focus:ring-2 focus:ring-green-500"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-3 border rounded-lg
bg-white dark:bg-gray-700
dark:border-gray-600
dark:text-white
focus:outline-none focus:ring-2 focus:ring-green-500"
/>

<button
disabled={loading}
className="w-full bg-green-600 hover:bg-green-700
text-white p-3 rounded-lg transition
disabled:opacity-60"
>

{loading ? "Creating Account..." : "Register"}

</button>

<p className="text-center text-sm text-gray-500 dark:text-gray-400">

Already have an account?{" "}

<span
onClick={()=>navigate("/login")}
className="text-green-600 cursor-pointer hover:underline"
>

Login

</span>

</p>

</form>

)}

{/* EMAIL VERIFICATION SCREEN */}

{emailSent && (

<div className="text-center space-y-4">

<h2 className="text-2xl font-bold text-green-600">

Check Your Email 📧

</h2>

<p className="text-gray-600 dark:text-gray-300">

We sent a verification link to:

</p>

<p className="font-semibold break-all">

{email}

</p>

<p className="text-sm text-gray-500 dark:text-gray-400">

Open the link to activate your account.

</p>

<button
onClick={()=>navigate("/login")}
className="w-full bg-green-600 hover:bg-green-700
text-white p-3 rounded-lg transition"
>

Go to Login

</button>

</div>

)}

</div>

</div>

);

}