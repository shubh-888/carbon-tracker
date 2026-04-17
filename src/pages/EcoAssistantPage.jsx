import { useState, useEffect, useRef } from "react";
import { ecoAssistant } from "../lib/ai/ecoAssistant";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function EcoAssistantPage() {

const [messages, setMessages] = useState([
{
role: "ai",
text: "Hello 👋 I'm your Eco AI assistant. Ask me anything about reducing your carbon footprint."
}
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const bottomRef = useRef(null);

const [emissionData, setEmissionData] = useState({
transport: 0,
electricity: 0,
diet: 0,
total: 0
});

/* LOAD USER EMISSIONS */

useEffect(() => {

async function loadData() {

const uid = auth.currentUser?.uid;

if (!uid) return;

const q = query(
collection(db, "emissions"),
where("userId", "==", uid)
);

const snap = await getDocs(q);

let transport = 0;
let electricity = 0;
let diet = 0;
let total = 0;

snap.forEach(doc => {
const d = doc.data();

transport += d.transport || 0;
electricity += d.electricity || 0;
diet += d.diet || 0;
total += d.total || 0;
});

setEmissionData({
transport,
electricity,
diet,
total
});

}

loadData();

}, []);

/* AUTO SCROLL CHAT */

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

/* SEND MESSAGE */

async function sendMessage(message) {

if (!message.trim()) return;

const userMsg = { role: "user", text: message };

setMessages(prev => [...prev, userMsg]);
setInput("");
setLoading(true);

try {

const reply = await ecoAssistant(
emissionData,
message,
messages
);

setMessages(prev => [
...prev,
{ role: "ai", text: reply }
]);

} catch (err) {

console.error(err);

setMessages(prev => [
...prev,
{ role: "ai", text: "AI error. Please try again." }
]);

}

setLoading(false);

}

/* SUGGESTIONS */

const suggestions = [
"How can I reduce my carbon footprint?",
"Tips to reduce electricity usage at home",
"How does my diet affect emissions?",
"How can I reduce transport emissions?"
];

return (

<div className="w-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

{/* HEADER */}

<div className="p-6 border-b bg-white dark:bg-gray-800">

<h1 className="text-2xl font-bold">
🌱 Eco AI Assistant
</h1>

<p className="text-gray-500 text-sm">
Your personal sustainability advisor powered by AI
</p>

</div>

{/* CHAT AREA */}

<div className="flex-1 overflow-y-auto p-6 space-y-4">

{messages.map((m, i) => (

<div key={i} className={m.role === "user" ? "text-right" : ""}>

<span
className={`inline-block p-3 rounded-lg max-w-xl text-sm

${m.role === "user"
? "bg-green-600 text-white"
: "bg-gray-200 dark:bg-gray-700 dark:text-white"}

`}

>

{m.text}

</span>

</div>

))}

{loading && (

<p className="text-gray-400 text-sm">
AI thinking...
</p>
)}

<div ref={bottomRef}></div>

</div>

{/* SUGGESTION BUTTONS */}

<div className="px-6 pb-3 flex flex-wrap gap-2">

{suggestions.map((s, i) => (

<button
key={i}
onClick={() => sendMessage(s)}
className="text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:opacity-80"

>

{s}

</button>

))}

</div>

{/* INPUT AREA */}

<div className="border-t bg-white dark:bg-gray-800 p-4 flex gap-2">

<input
value={input}
onChange={(e) => setInput(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") {
sendMessage(input);
}
}}
placeholder="Ask about sustainability..."
className="flex-1 p-3 rounded border bg-transparent outline-none"
/>

<button
onClick={() => sendMessage(input)}
className="bg-green-600 text-white px-6 rounded hover:bg-green-700"

>

Send

</button>

</div>

</div>

);

}
