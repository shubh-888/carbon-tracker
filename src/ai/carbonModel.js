import * as tf from "@tensorflow/tfjs";

export function getAITips(data){

const inputs = tf.tensor2d([[
data.electricity,
data.transport,
data.flights,
data.diet,
data.waste
]]);

// simple weight matrix (simulated ML model)
const weights = tf.tensor2d([
[0.4],
[0.3],
[0.2],
[0.07],
[0.03]
]);

const prediction = inputs.matMul(weights);
const score = prediction.dataSync()[0];

let tips = [];

if(data.electricity > 200){
tips.push("Switch to renewable electricity or install solar panels.");
}

if(data.transport > 150){
tips.push("Use public transport, carpool, or electric vehicles.");
}

if(data.flights > 100){
tips.push("Reduce flights or choose airlines with carbon offset programs.");
}

if(data.diet > 200){
tips.push("Adopt a more plant-based diet to reduce food emissions.");
}

if(data.waste > 50){
tips.push("Recycle, compost food waste, and reduce plastic usage.");
}

if(tips.length === 0){
tips.push("Great job! Your carbon footprint is already low.");
}

return {
score: score,
tips: tips
};

}