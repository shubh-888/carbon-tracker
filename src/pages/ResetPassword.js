import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword(){

const [email,setEmail] = useState("");
const [loading,setLoading] = useState(false);

const navigate = useNavigate();

const handleReset = async(e)=>{

e.preventDefault();

if(!email){
toast.error("Enter your email");
return;
}

try{

setLoading(true);

await sendPasswordResetEmail(auth,email);

toast.success("Password reset email sent");

navigate("/login");

}catch(error){

if(error.code==="auth/user-not-found"){
toast.error("Email not registered");
}
else if(error.code==="auth/invalid-email"){
toast.error("Invalid email");
}
else{
toast.error("Failed to send reset email");
}

}
finally{
setLoading(false);
}

};

return(

<div className="min-h-screen flex items-center justify-center">

<form
onSubmit={handleReset}
className="bg-white shadow-xl p-8 rounded-xl w-96 space-y-4"
>

<h2 className="text-2xl font-bold text-center">
Reset Password
</h2>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-3 border rounded"
/>

<button
disabled={loading}
className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
>
{loading ? "Sending..." : "Send Reset Link"}
</button>

<p
className="text-center text-sm text-green-600 cursor-pointer"
onClick={()=>navigate("/login")}
>
Back to Login
</p>

</form>

</div>

);

}