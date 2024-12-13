// Definizione della funzione
const isNotEmptyOrNull = arr => arr.some(item => item !== null && item !== undefined);

// Estrai date (labels) e valori medi (data) dal risultato PHP
const days = dataFromPHP.map(item => item.Giorno); // Estrarre le date
const vMedio = dataFromPHP.map(item => item.ValoreMedio); 
const vMin = dataFromPHP.map(item => item.ValoreMin);
const vMax = dataFromPHP.map(item => item.ValoreMax);
let data = {};
// console.log("vMin: "+vMin)
// console.log("vMax: "+vMax)
// console.log("vMedio: "+vMedio)
if(isNotEmptyOrNull(vMin) && isNotEmptyOrNull(vMedio) && isNotEmptyOrNull(vMax)){
    data = {
        labels: days,
        datasets: [{
            label: 'Valore Medio Giornaliero ' + tipoSensore,
            data: vMedio,
            backgroundColor: 'rgba(61, 64, 92, 0.2)',
            borderColor: 'rgba(61, 64, 92, 1)',	
            borderWidth: 1
        },{
            label: 'Valore Max Giornaliero ' + tipoSensore,
            data: vMax,
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderColor: 'rgba(255, 0, 0, 1)',	
            borderWidth: 1
        },{
            label: 'Valore Min Giornaliero ' + tipoSensore,
            data: vMin,
            backgroundColor: 'rgba(137, 207, 240, 0.4)',
            borderColor: 'rgba(137, 207, 240, 1)',	
            borderWidth: 1
        }]
    };
}else if(isNotEmptyOrNull(vMin) && isNotEmptyOrNull(vMax)){
    data = {
        labels: days,
        datasets: [{
            label: 'Valore Min Giornaliero ' + tipoSensore,
            data: vMin,
            backgroundColor: 'rgba(137, 207, 240, 0.4)',
            borderColor: 'rgba(137, 207, 240, 1)',	
            borderWidth: 1,
            fill: true, // Riempie l'area sotto questo dataset
        },{
            label: 'Valore Max Giornaliero ' + tipoSensore,
            data: vMax,
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            borderColor: 'rgba(255, 0, 0, 1)',	
            borderWidth: 1,
            fill: true, // Riempie l'area tra questo dataset e quello precedente
        }]
    };
}else if(isNotEmptyOrNull(vMedio)){
    data = {
        labels: days,
        datasets: [{
            label: 'Valore Medio Giornaliero ' + tipoSensore,
            data: vMedio,
            backgroundColor: [
                'rgba(61, 64, 92, 0.2)'
            ],
            borderColor: [
                'rgba(61, 64, 92, 1)'
            ],	
            borderWidth: 1
        }]
    };
}else if(isNotEmptyOrNull(vMax)){
    data = {
        labels: days,
        datasets: [{
            label: 'Valore Max Giornaliero ' + tipoSensore,
            data: vMax,
            backgroundColor: [
                'rgba(230, 10, 10, 0.2)'
            ],
            borderColor: [
                'rgba(230, 10, 10, 1)'
            ],	
            borderWidth: 1
        }]
    };
}

// Config Block
const config = {
type: configurazioneSensori[tipoSensore].grafico,
    data,
    options: {
        responsive: true,   
        scales: {
            x: {
                ticks: {
                    autoSkip: false, // Mostra tutte le etichette
                    minRotation: 45 // Ruota le etichette di 45 gradi
                }
            },
            y: {
                min: configurazioneSensori[tipoSensore].range.min - Math.abs(configurazioneSensori[tipoSensore].range.min * 0.2), // Margine del 10% in meno
                max: configurazioneSensori[tipoSensore].range.max + (configurazioneSensori[tipoSensore].range.max * 0.2), // Margine del 10% in più
                ticks: {
                    callback: value => `${value} ${configurazioneSensori[tipoSensore].unita}`
                }
            }
        }
    }
};

// Aggiungi personalizzazioni per il sensore "Temperatura"
if ((tipoSensore === "Temperatura") || (tipoSensore === "Luminosità")) {
    config.options.plugins = {
        legend: {
            display: true,
            position: 'top',
        },
    };
    config.options.elements = {
        line: { tension: 0.4 }, // Smoothing specifico per la Temperatura
    };
}
// console.log(days)
// console.log(vMedio)
console.log(config.options.scales.y)
// Render Block
const myChart = new Chart(
    document.getElementById('chart'),
    config
);