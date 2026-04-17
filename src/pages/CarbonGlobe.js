import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

import { fetchGlobalEmissions } from "../api/emissionsApi";
import { countryCoords } from "../data/countryCoords";

/* LAT LNG → SPHERE */

function convert(lat, lng, radius = 2.1) {

const phi = (90 - lat) * (Math.PI / 180)
const theta = (lng + 180) * (Math.PI / 180)

const x = -(radius * Math.sin(phi) * Math.cos(theta))
const z = radius * Math.sin(phi) * Math.sin(theta)
const y = radius * Math.cos(phi)

return [x, y, z]

}

/* EARTH */

function Earth() {

const ref = useRef()
const texture = useLoader(TextureLoader, "/textures/earth.jpg")

useFrame(() => {
if (ref.current) {
ref.current.rotation.y += 0.0008
}
})

return (

<mesh ref={ref}>
<sphereGeometry args={[2, 64, 64]} />
<meshStandardMaterial map={texture} />
</mesh>

)

}

/* EMISSION COLOR SCALE */

function getEmissionColor(value) {

if (value > 5000) return "red"
if (value > 2000) return "orange"
if (value > 800) return "yellow"
return "green"

}

/* HOTSPOTS */

function Hotspots({ countries, onSelect }) {

return (

<>
{countries.map((c, i) => {

const pos = convert(c.lat, c.lng)
const color = getEmissionColor(c.emission)

return (

<mesh
key={i}
position={pos}
onClick={() => onSelect(c)}
>

<sphereGeometry args={[0.07, 16, 16]} />

<meshStandardMaterial
color={color}
emissive={color}
emissiveIntensity={1}
/>

</mesh>

)

})}
</>

)

}

/* POPUP */

function CountryPopup({ country }) {

if (!country) return null

const pos = convert(country.lat, country.lng, 2.3)

return (

<Html position={pos} center>

<div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl w-44 border border-gray-600">

<h3 className="font-semibold text-sm flex items-center gap-2">
🌍 {country.country}
</h3>

<p className="text-xs text-gray-400 mt-1">
Carbon Emissions
</p>

<p className="text-lg font-bold text-red-400">
{country.emission} kt
</p>

<p className="text-[10px] text-gray-500 mt-1">
Source: Global Climate API
</p>

</div>

</Html>

)

}

/* MAIN PAGE */

export default function CarbonGlobe() {

const [countries, setCountries] = useState([])
const [selected, setSelected] = useState(null)

useEffect(() => {

async function load() {

try {

const data = await fetchGlobalEmissions()

let formatted = []

if (data && data.length) {

formatted = data
.filter(d => d && d.value)
.slice(0, 10)
.map(d => {

const name = d.country?.value
const coords = countryCoords[name]

return {

country: name || "Unknown",
emission: d.value || 0,
lat: coords?.lat ?? (Math.random() * 140 - 70),
lng: coords?.lng ?? (Math.random() * 360 - 180)

}

})

}

/* FALLBACK */

if (!formatted.length) {

formatted = [

{ country: "China", emission: 11472, lat: 39.9, lng: 116.4 },
{ country: "United States", emission: 5007, lat: 38.9, lng: -77 },
{ country: "India", emission: 2654, lat: 28.6, lng: 77.2 },
{ country: "Russia", emission: 1711, lat: 55.7, lng: 37.6 },
{ country: "Japan", emission: 1162, lat: 35.6, lng: 139.7 },
{ country: "Germany", emission: 759, lat: 52.5, lng: 13.4 },
{ country: "Iran", emission: 720, lat: 35.6, lng: 51.3 },
{ country: "South Korea", emission: 650, lat: 37.5, lng: 127 },
{ country: "Saudi Arabia", emission: 635, lat: 24.7, lng: 46.6 },
{ country: "Indonesia", emission: 615, lat: -6.2, lng: 106.8 }

]

}

setCountries(formatted)

} catch (err) {

console.error(err)

}

}

load()

}, [])

const sorted = [...countries].sort((a, b) => b.emission - a.emission)

return (

<div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">

{/* SIDEBAR */}

<div className="lg:w-72 w-full p-6 border-b lg:border-b-0 lg:border-r border-gray-300 dark:border-gray-700">

<h2 className="text-xl font-bold mb-4">
Top Carbon Emitters
</h2>

{sorted.map((c, i) => (

<div key={i} className="flex justify-between py-2 border-b text-sm">

<span>{i + 1}. {c.country}</span>

<span className="text-red-500">
{c.emission}
</span>

</div>

))}

<div className="mt-6 text-xs text-gray-500">

<p className="font-semibold">Data Source</p>
<p>Global Climate API</p>
<p>CO₂ emissions measured in kilotons (kt)</p>

</div>

</div>

{/* GLOBE */}

<div className="flex-1 p-6">

<h1 className="text-2xl md:text-3xl font-bold mb-6">
🌍 Global Carbon Emission Globe
</h1>

<div className="h-[500px] md:h-[700px] rounded-xl overflow-hidden border">

<Canvas camera={{ position: [0, 0, 5] }}>

<ambientLight intensity={0.8} />
<directionalLight position={[5, 5, 5]} intensity={1.2} />

<Stars radius={100} depth={50} count={5000} factor={4} />

<Earth />

<Hotspots countries={countries} onSelect={setSelected} />

<CountryPopup country={selected} />

<OrbitControls enableZoom enablePan={false} />

</Canvas>

</div>

</div>

</div>

)

}