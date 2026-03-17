import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { auth } from "../firebase/firebaseConfig";

export default function HistoryReport({ data }) {

const generatePDF = () => {

const doc = new jsPDF();
const userName =auth.currentUser.name;
doc.setFontSize(18);
doc.text("EcoTrack Carbon Emission Report", 14, 20);

doc.setFontSize(11);


doc.text(
"UserID: " + auth.currentUser.email,
14,
30
);

doc.text(
"Name: " + userName,
14,
38
);

doc.text(
"Generated On: " + new Date().toLocaleDateString(),
14,
46
);

const tableData = data.map(item=>{

const status =
item.total < 2500
? "Good"
: item.total < 3500
? "Average"
: "High";

return[
new Date(item.date.seconds*1000).toLocaleDateString(),
item.total + " kg",
status
];

});

autoTable(doc,{
head:[["Date","Total Emissions","Status"]],
body:tableData,
startY:50
});

doc.save("carbon-history-report.pdf");

};

return(

<button
onClick={generatePDF}
className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>

Download PDF

</button>

);

}