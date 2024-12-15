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
    // "Direzione del vento": {
    //     unita: "°",
    //     range: { min: 0.0, max: 360.0 },
    //     grafico: "Area" // Grafico polare per direzioni
    // },
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

const colori = [
    '#F2CC8F', // Sabbia
    '#E07A5F', // Terracotta
    '#3D405B', // Grigio ardesia scuro
    '#81B29A', // Verde menta
    '#FF6347', // Rosso tomato
    '#4682B4', // Acciaio
    '#6A5ACD', // Blu ardesia
    '#2E8B57', // Verde mare
    '#B8860B', // Oro antico
    '#DAA520', // Oro
    '#CD5C5C', // Rosa indiano
    '#FF4500', // Arancione rosso
    '#008080', // Verde petrolio
    '#A0522D', // Marrone legno
    '#DC143C', // Cremisi
    '#8A2BE2', // Blu violaceo
    '#228B22', // Verde bosco
    '#D2691E'  // Marrone cioccolato
];
  

function hexToRgba(hex, alpha = 0){
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

function isJSON(str) { 
    try { 
        JSON.parse(str); 
    } catch (e) { 
        return false; 
    } 
    return true; 
}

function unicodeToUTF8(inputStr) { 
    return inputStr.replace(/\\u[\dA-F]{4}/gi, function (match) { 
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)); 
    }); 
}

function noDataFoundAlert(id, sensor, color) {
    console.log('No data found: ' + id);
    
    // Trova il div
    const divElement = document.getElementById(id);
    divElement.style.cssText = 'width: -webkit-fill-available; height: 400px;';

    // Crea il nuovo div interno e imposta i suoi stili
    const innerDiv = document.createElement('div');
    innerDiv.id = id + 'NoDataFound';
    innerDiv.style.cssText = 'height: -webkit-fill-available; display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;';

    // Crea il label con il testo e i suoi stili
    const label = document.createElement('label');
    label.style.backgroundColor = color;
    label.innerHTML = '<h5 style="margin: 10px; font-weight: bold;">Nessun dato per ' + sensor + '.</h5>';

    // Aggiungi gli elementi al DOM
    innerDiv.appendChild(label);
    divElement.appendChild(innerDiv);
}

function createChart(container, type, title, dataSeries, color) {
    // console.log(container);
    // console.log(type);
    // console.log(title);
    // console.log(dataSeries);
    
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
                color: 'transparent',
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, hexToRgba(color, 0.1)],
                    [1, hexToRgba(color, 0.3)]
                ]
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

function defineChart(city, sensor, interval = '1 MONTH') {    
    var url = `php/dati_charts.php`;
    var data = { 
        citta: decodeURIComponent(encodeURIComponent(city)), 
        tipo_sensore: decodeURIComponent(encodeURIComponent(sensor)), 
        interval: interval
    };

    $.ajax({
        url: url,
        method: 'GET',
        data: data,
        success: function(data) {
            data = data.split('_');
            console.log(data);

            try {
                if (data.error) {
                    console.error(data.error);
                    alert("Errore nel caricamento dei dati: " + data.error);
                } else {
                    var sensor = unicodeToUTF8(data[1].replaceAll('"', ''));
                    if (!isJSON(data[0])){
                        var values = {
                            'Errore': 'Sensore non valido.'
                        };
                        // console.log(sensor + ': ' + `chart${sensor.replace(/\s/g, '')}`);
                        noDataFoundAlert(`chart${sensor.replace(/\s/g, '')}`, sensor, hexToRgba(colori[0], 0.3));                    
                    } else {
                        var values = JSON.parse(data[0]);
                        createChart(`chart${sensor.replace(/\s/g, '')}`, configurazioneSensori[sensor].grafico, sensor, values, colori[0]);
                    }
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
}

function whichCharts() {
    var value = document.getElementById('selectWhichCity').textContent;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/query.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var container = document.getElementById('chartsContainer');
            container.innerHTML = ''; // Clear the container before adding new elements

            if (Array.isArray(response)) {
                response.forEach(function(item) {                    
                    var divCol = document.createElement('div');
                    divCol.className = 'col-md-6';

                    var divChartContainer = document.createElement('div');
                    divChartContainer.className = 'chart-container';

                    var divChart = document.createElement('div');
                    divChart.id = 'chart' + item.Tipo.replace(/\s/g, '');

                    divChartContainer.appendChild(divChart);
                    divCol.appendChild(divChartContainer);
                    container.appendChild(divCol);

                    defineChart(item.Nome, item.Tipo);
                });
            } else {
                console.error('Unexpected response format:', response);
            }
        }
    };
    xhr.send('city=' + encodeURIComponent(value));
}

function getCities(selectCityDiv) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/query.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);

            if (Array.isArray(response)) {
                var dropdown = document.createElement('ul');
                dropdown.className = 'city-dropdown';
                response.forEach(function(item) {
                    var cityItem = document.createElement('li');
                    cityItem.textContent = item.Nome;
                    cityItem.addEventListener('click', function() {
                        selectCityDiv.textContent = item.Nome;
                        document.body.removeChild(dropdown);
                        whichCharts();
                    });
                    dropdown.appendChild(cityItem);
                });

                // Remove existing dropdown if it exists
                var existingDropdown = document.querySelector('.city-dropdown');
                if (existingDropdown) {
                    document.body.removeChild(existingDropdown);
                }

                // Position dropdown
                var rect = selectCityDiv.getBoundingClientRect(); 
                dropdown.style.position = 'absolute'; 
                dropdown.style.left = (rect.left + rect.width / 2 - dropdown.offsetWidth / 2) + 'px'; 
                dropdown.style.top = (rect.bottom + window.scrollY) + 'px'; 
                
                document.body.appendChild(dropdown); 
                
                // Re-calculate position after adding to the DOM to ensure proper centering 
                var dropdownRect = dropdown.getBoundingClientRect(); 
                dropdown.style.left = (rect.left + rect.width / 2 - dropdownRect.width / 2) + 'px';
            } else {
                console.error('Unexpected response format:', response);
            }
        }
    };
    xhr.send('cities=true');
}

document.addEventListener('DOMContentLoaded', function() {
    var selectCityDiv = document.getElementById('selectWhichCity');

    whichCharts();

    selectCityDiv.addEventListener('click', function(event) {
        event.stopPropagation();
        getCities(selectCityDiv);
    });

    document.addEventListener('click', function(event) {
        var dropdown = document.querySelector('.city-dropdown');
        if (dropdown && !dropdown.contains(event.target)) {
            document.body.removeChild(dropdown);
        }
    });
});
