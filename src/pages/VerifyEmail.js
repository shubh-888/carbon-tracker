import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebaseConfig";

import {
applyActionCode,
signInWithEmailAndPassword
} from "firebase/auth";

export default function VerifyEmail(){

const navigate = useNavigate();

useEffect(()=>{

const verify = async ()=>{

try{

const params = new URLSearchParams(window.location.search);

const oobCode = params.get("oobCode");
const email = localStorage.getItem("verifyEmail");
const password = localStorage.getItem("verifyPassword");

if(!oobCode) return;

/* verify email */

await applyActionCode(auth,oobCode);

/* auto login */

if(email && password){

await signInWithEmailAndPassword(auth,email,password);

}

/* redirect immediately */

navigate("/dashboard");

}catch(error){

console.error(error);
navigate("/login");

}

};

verify();

},[navigate]);

return null;

}