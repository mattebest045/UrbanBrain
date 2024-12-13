const configurazioneSensori = {
    "Temperatura": {
        unita: "°C",
        range: { min: -20.0, max: 50.0 },
        grafico: "line" // AREA CHART
    },
    "Umidità": {
        unita: "%",
        range: { min: 0.0, max: 100.0 },
        grafico: "line"
    },
    "Luminosità": {
        unita: "lx",
        range: { min: 0.0, max: 100000.0 },
        grafico: "line" // AREA CHART
    },
    "Pressione atmosferica": {
        unita: "hPa",
        range: { min: 950.0, max: 1050.0 },
        grafico: "line"
    },
    "Qualità dell`aria": {
        unita: "AQI",
        range: { min: 0.0, max: 500.0 },
        grafico: "bar" // Barre per rappresentare categorie
    },
    "Rumore": {
        unita: "dB",
        range: { min: 30.0, max: 130.0 },
        grafico: "line"
    },
    "Livello di CO2": {
        unita: "ppm",
        range: { min: 300.0, max: 5000.0 },
        grafico: "line"
    },
    "Velocità del vento": {
        unita: "m/s",
        range: { min: 0.0, max: 40.0 },
        grafico: "line"
    },
    "Direzione del vento": {
        unita: "°",
        range: { min: 0.0, max: 360.0 },
        grafico: "polarArea" // Grafico polare per direzioni
    },
    "Pioggia": {
        unita: "mm",
        range: { min: 0.0, max: 500.0 },
        grafico: "bar"
    },
    "Livello dell`acqua": {
        unita: "m",
        range: { min: 0.0, max: 10.0 },
        grafico: "bar"
    },
    "Radiazione UV": {
        unita: "UV",
        range: { min: 0.0, max: 11.0 },
        grafico: "bar"
    },
    "Consumo energetico": {
        unita: "kWh",
        range: { min: 0.0, max: 10000.0 },
        grafico: "line"
    },
    "Livello di PM2.5": {
        unita: "µg/m³",
        range: { min: 0.0, max: 500.0 },
        grafico: "line"
    },
    "Livello di PM10": {
        unita: "µg/m³",
        range: { min: 0.0, max: 500.0 },
        grafico: "line"
    },
    "Rilevamento incendi": {
        unita: "MJ",
        range: { min: 0.0, max: 1.0 },
        grafico: "line"
    },
    "Rilevamento gas": {
        unita: "ppm",
        range: { min: 0.0, max: 1000.0 },
        grafico: "line"
    },
    "Vibrazioni": {
        unita: "m/s²",
        range: { min: 0.0, max: 10.0 },
        grafico: "line"
    }
};

$(document).ready(function() {
    // controlla che la lista non sia nulla prima di fare una post
	// document.querySelector('form').addEventListener('submit', function(event) {
	// 	const sensorInput = document.getElementById('sensor').value.trim();
	// 	if (!sensorInput) {
	// 		alert("Per favore seleziona un sensore dalla lista!");
	// 		event.preventDefault(); // Blocca l'invio del form
	// 	}
	// });

	// document.addEventListener("DOMContentLoaded", () => {
	// 	// Assicurati che `ruoloAdmin` non sia null o undefined
	// 	const citta = json_encode($value, JSON_HEX_TAG) || [];
	// 	// console.log("citta: "+citta)
	// 	// Riferimenti agli elementi HTML
	// 	const lista_citta = document.getElementById("dati-citta");
	// 	if (lista_citta) {
	// 		// Svuota la datalist corrente
	// 		lista_citta.innerHTML = "";
	// 		// Aggiungi i nuovi ruoli
	// 		citta.forEach(role => {
	// 			const option = document.createElement("option");
	// 			option.value = role;
	// 			lista_citta.appendChild(option);
	// 		});
	// 	}
	// })

    function createChart(container, type, title, dataSeries, color) {
        // Estrai le categorie dall'oggetto dataSeries 
        const xLabels = dataSeries.map(item => item.Giorno); 
        
        // Inizializza un oggetto per le serie 
        const seriesData = {}; 
        dataSeries.forEach(item => { 
            Object.keys(item).forEach(key => { 
                if (key !== 'Giorno') { 
                    if (!seriesData[key]) { 
                        seriesData[key] = []; 
                    } 
                    seriesData[key].push(item[key]); 
                } 
            }); 
        }); 
        
        // Converte l'oggetto delle serie in un array di serie per Highcharts 
        const series = Object.keys(seriesData).map((key, index) => ({
             name: key, 
             data: seriesData[key], 
             color: Array.isArray(color) ? colorMap[index] : color }));
        
        Highcharts.chart(container, {
            chart: {
                type: type,
                backgroundColor: {
                    color: 'transparent'
                    // linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    // stops: [
                    //     [0, 'rgba(255, 255, 255, 1)'],
                    //     [1, 'rgba(129, 178, 154, 0.2)']
                    // ]
                },
                borderRadius: 10
            },
            title: {
                text: title
            },
            xAxis: {
                categories: xLabels
            },
            yAxis: {
                title: {
                    text: title
                }
            },
            series: series,
            accessibility: {
                enabled: false
            }
        });
    }

    $.ajax({
        url: 'php/dati_charts.php?citta=Roma&interval=1%20MONTH&tipo_sensore=Temperatura',
        method: 'GET',
        success: function(data) {
            console.log("Dati ricevuti:", data);  // Debug: mostra i dati ricevuti
            data = data.split('_');
            console.log("", JSON.parse(data[0]));  // Debug: mostra i dati ricevuti
            console.log("", data[1].replaceAll('"',''));  // Debug: mostra i dati ricevuti

            try {
                if (data.error) {
                    console.error(data.error);
                    alert("Errore nel caricamento dei dati: " + data.error);
                } else {
                    var values = JSON.parse(data[0]);
                    var sensor = data[1].replaceAll('"','');

                    createChart('temperatureChart', 'line', sensor, values, '#81B29A');
                    // createChart('humidityChart', 'column', 'Umidità', sensors.labels, sensors.humidity, '#3D405B');
                    // createChart('lightChart', 'line', 'Luminosità', sensors.labels, sensors.light, '#F2CC8F');
                    // createChart('pressureChart', 'column', 'Pressione atmosferica', sensors.labels, sensors.pressure, '#E07A5F');
                    // createChart('airQualityChart', 'line', 'Qualità dell`aria', sensors.labels, sensors.airQuality, '#FF6347');
                    // createChart('noiseChart', 'column', 'Rumore', sensors.labels, sensors.noise, '#4682B4');
                    // createChart('co2Chart', 'line', 'Livello di CO2', sensors.labels, sensors.co2, '#6A5ACD');
                    // createChart('windSpeedChart', 'column', 'Velocità del vento', sensors.labels, sensors.windSpeed, '#2E8B57');
                    // createChart('windDirectionChart', 'line', 'Direzione del vento', sensors.labels, sensors.windDirection, '#B8860B');
                    // createChart('rainfallChart', 'column', 'Pioggia', sensors.labels, sensors.rainfall, '#DAA520');
                    // createChart('waterLevelChart', 'line', 'Livello dell`acqua', sensors.labels, sensors.waterLevel, '#CD5C5C');
                    // createChart('uvRadiationChart', 'column', 'Radiazione UV', sensors.labels, sensors.uvRadiation, '#FF4500');
                    // createChart('energyConsumptionChart', 'line', 'Consumo energetico', sensors.labels, sensors.energyConsumption, '#008080');
                    // createChart('pm25Chart', 'column', 'Livello di PM2.5', sensors.labels, sensors.pm25, '#4682B4');
                    // createChart('pm10Chart', 'line', 'Livello di PM10', sensors.labels, sensors.pm10, '#A0522D');
                    // createChart('fireDetectionChart', 'column', 'Rilevamento incendi', sensors.labels, sensors.fireDetection, '#DC143C');
                    // createChart('gasDetectionChart', 'line', 'Rilevamento gas', sensors.labels, sensors.gasDetection, '#8A2BE2');
                    // createChart('vibrationsChart', 'column', 'Vibrazioni', sensors.labels, sensors.vibrations, '#228B22');
                    // createChart('publicLightingChart', 'line', 'Illuminazione pubblica', sensors.labels, sensors.publicLighting, '#D2691E');
                    // Aggiungi ulteriori grafici qui
                }
            } catch (e) {
                console.error("Errore nel parsing JSON:", e);
                alert("Errore nel parsing dei dati JSON.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Errore AJAX:", status, error);
        }
    });
});
