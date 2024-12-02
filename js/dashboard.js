$(document).ready(function() {
    function createChart(container, type, title, categories, data, color) {
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
                categories: categories
            },
            yAxis: {
                title: {
                    text: title
                }
            },
            series: [{
                name: title,
                data: data,
                color: color
            }],
            accessibility: {
                enabled: false
            }
        });
    }

    $.ajax({
        url: 'php/api.php',
        method: 'GET',
        success: function(data) {
            console.log("Dati ricevuti:", data);  // Debug: mostra i dati ricevuti

            try {
                if (data.error) {
                    console.error(data.error);
                    alert("Errore nel caricamento dei dati: " + data.error);
                } else {
                    // I dati sono già in formato JSON, non serve parsare nuovamente
                    var sensors = data;

                    createChart('temperatureChart', 'line', 'Temperatura', sensors.labels, sensors.temperature, '#81B29A');
                    createChart('humidityChart', 'column', 'Umidità', sensors.labels, sensors.humidity, '#3D405B');
                    createChart('lightChart', 'line', 'Luminosità', sensors.labels, sensors.light, '#F2CC8F');
                    createChart('pressureChart', 'column', 'Pressione atmosferica', sensors.labels, sensors.pressure, '#E07A5F');
                    createChart('airQualityChart', 'line', 'Qualità dell`aria', sensors.labels, sensors.airQuality, '#FF6347');
                    createChart('noiseChart', 'column', 'Rumore', sensors.labels, sensors.noise, '#4682B4');
                    createChart('co2Chart', 'line', 'Livello di CO2', sensors.labels, sensors.co2, '#6A5ACD');
                    createChart('windSpeedChart', 'column', 'Velocità del vento', sensors.labels, sensors.windSpeed, '#2E8B57');
                    createChart('windDirectionChart', 'line', 'Direzione del vento', sensors.labels, sensors.windDirection, '#B8860B');
                    createChart('rainfallChart', 'column', 'Pioggia', sensors.labels, sensors.rainfall, '#DAA520');
                    createChart('waterLevelChart', 'line', 'Livello dell`acqua', sensors.labels, sensors.waterLevel, '#CD5C5C');
                    createChart('uvRadiationChart', 'column', 'Radiazione UV', sensors.labels, sensors.uvRadiation, '#FF4500');
                    createChart('energyConsumptionChart', 'line', 'Consumo energetico', sensors.labels, sensors.energyConsumption, '#008080');
                    createChart('pm25Chart', 'column', 'Livello di PM2.5', sensors.labels, sensors.pm25, '#4682B4');
                    createChart('pm10Chart', 'line', 'Livello di PM10', sensors.labels, sensors.pm10, '#A0522D');
                    createChart('fireDetectionChart', 'column', 'Rilevamento incendi', sensors.labels, sensors.fireDetection, '#DC143C');
                    createChart('gasDetectionChart', 'line', 'Rilevamento gas', sensors.labels, sensors.gasDetection, '#8A2BE2');
                    createChart('vibrationsChart', 'column', 'Vibrazioni', sensors.labels, sensors.vibrations, '#228B22');
                    createChart('publicLightingChart', 'line', 'Illuminazione pubblica', sensors.labels, sensors.publicLighting, '#D2691E');
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
