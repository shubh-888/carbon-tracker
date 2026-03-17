import jsPDF from "jspdf";

export default function DownloadReport({carbon}){

function generatePDF(){

const doc = new jsPDF()

doc.text("Carbon Footprint Report",20,20)

doc.text(
"Total Carbon Emission: " + carbon + " kg CO2",
20,
40
)

doc.save("carbon-report.pdf")

}

return(

<button
onClick={generatePDF}
className="bg-blue-600 text-white px-4 py-2 rounded">

Download Report

</button>

)

}