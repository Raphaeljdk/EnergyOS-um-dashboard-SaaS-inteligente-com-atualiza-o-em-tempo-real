const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log("🚀 WebSocket rodando em ws://localhost:8080");

let consumption = [80,82,85,88,90,93];
let finance = [120000,130000,110000,140000,125000,150000];

function generateNewValue(last, variance){
    return Math.round(last + (Math.random()*variance - variance/2));
}

wss.on('connection', (ws) => {

    console.log("📡 Cliente conectado");

    const interval = setInterval(() => {

        consumption.push(generateNewValue(consumption[5],6));
        consumption.shift();

        finance.push(generateNewValue(finance[5],20000));
        finance.shift();

        const payload = {
            type: "update",
            consumption,
            finance,
            timestamp: new Date().toISOString(),
            alert: Math.random() > 0.85 
                ? "⚠ Oscilação detectada às " + new Date().toLocaleTimeString()
                : null
        };

        ws.send(JSON.stringify(payload));

    }, 5000);

    ws.on('close', () => {
        console.log("❌ Cliente desconectado");
        clearInterval(interval);
    });

});
let socket;

function connectWebSocket(){

    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
        console.log("✅ Conectado ao WebSocket");
    };

    socket.onmessage = (event) => {

        const data = JSON.parse(event.data);

        if(data.type === "update"){

            // Atualiza gráfico consumo
            overviewChart.data.datasets[0].data = data.consumption;
            overviewChart.update();

            // Atualiza gráfico financeiro
            financeChart.data.datasets[0].data = data.finance;
            financeChart.update();

            // Atualiza IA
            updateAIInsight();

            // Atualiza projeção
            generateProjection();

            // Novo alerta
            if(data.alert){
                mockAlerts.push({message: data.alert});
                loadAlerts();
            }
        }
    };

    socket.onerror = (error) => {
        console.error("Erro WebSocket:", error);
    };

    socket.onclose = () => {
        console.log("🔌 Conexão encerrada. Reconectando...");
        setTimeout(connectWebSocket, 3000);
    };
}
