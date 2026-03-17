import { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleRegister = async(e)=>{

e.preventDefault();

if(!name || !email || !password){
toast.error("Please fill all fields");
return;
}

try{

const userCredential =
await createUserWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

/* Save user profile in Firestore */

await setDoc(doc(db,"users",user.uid),{
name:name,
email:email,
avatar:""
});

toast.success("Account created successfully!");

navigate("/dashboard");

}
catch(error){

if(error.code === "auth/email-already-in-use"){

toast.error("This email is already registered");

}
else if(error.code === "auth/invalid-email"){

toast.error("Please enter a valid email address");

}
else if(error.code === "auth/weak-password"){

toast.error("Password must be at least 6 characters");

}
else{

toast.error("Registration failed. Please try again");

}

}

};

return(

<div className="max-w-md mx-auto bg-white p-6 rounded shadow">

<h2 className="text-xl font-bold mb-4">
Register
</h2>

<form onSubmit={handleRegister} className="space-y-4">

<input
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="border p-2 w-full rounded"
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-2 w-full rounded"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 w-full rounded"
/>

<button className="bg-green-600 text-white px-4 py-2 rounded w-full">
Register
</button>

</form>

</div>

)

}