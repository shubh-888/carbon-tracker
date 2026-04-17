import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";

import {
createUserWithEmailAndPassword,
sendEmailVerification,
signOut
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

const userCredential =
await createUserWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

/* send verification link to your UI */

await sendEmailVerification(user,{
url: window.location.origin + "/verify-email",
handleCodeInApp: true
});

/* store profile */

await setDoc(doc(db,"users",user.uid),{
name,
email,
points:0,
createdAt: serverTimestamp()
});

await signOut(auth);

setEmailSent(true);

toast.success("Verification email sent");

}catch(error){

if(error.code==="auth/email-already-in-use"){
toast.error("Email already registered");
}
else{
toast.error("Registration failed");
}

}
finally{
setLoading(false);
}

};

return(

<div className="min-h-screen flex items-center justify-center">

<div className="bg-white shadow-xl p-8 rounded-xl w-96">

{!emailSent && (

<form onSubmit={handleRegister} className="space-y-4">

<h2 className="text-2xl font-bold text-center text-green-600">
Create Account 🌱
</h2>

<input
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full p-3 border rounded"
/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-3 border rounded"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-3 border rounded"
/>

<button
disabled={loading}
className="w-full bg-green-600 text-white p-3 rounded"
>
{loading ? "Creating..." : "Register"}
</button>

</form>

)}

{emailSent && (

<div className="text-center space-y-4">

<h2 className="text-xl font-bold text-green-600">
Check your email 📧
</h2>

<p>We sent a verification link to:</p>

<p className="font-semibold">{email}</p>

<button
onClick={()=>navigate("/login")}
className="w-full bg-green-600 text-white p-3 rounded"
>
Go to Login
</button>

</div>

)}

</div>

</div>

);

}