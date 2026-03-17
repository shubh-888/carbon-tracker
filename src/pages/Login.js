import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";


export default function Login(){

const[email,setEmail] = useState("");
const[password,setPassword] = useState("");

const navigate = useNavigate();

async function login(){

try{

await signInWithEmailAndPassword(auth,email,password);

navigate("/dashboard");

}
catch(error){

toast.error("Invalid credentials");

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white p-8 rounded-xl shadow w-96">

<h2 className="text-2xl font-bold mb-6 text-center">
Login
</h2>

<input
className="w-full border p-2 rounded mb-4"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="w-full border p-2 rounded mb-4"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">

Login

</button>

<p className="text-center mt-4 text-sm">

Don't have an account?  
<Link to="/register" className="text-green-600 ml-1">
Register
</Link>

</p>

</div>

</div>

)

}