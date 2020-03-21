// Servidor TCP
const net = require('net');

// variables servidor
const puerto = 9000;

// iniciamos servidor
iniciarServidor();

function iniciarServidor() {
	// Creamos el servidor TCP
	const server = net.createServer();

	// Emite cuando el socket está listo y escuchando mensajes de datagramas
	server.listen(puerto, 'localhost', () => {
		const address = server.address();
		const port = address.port;
		const ipaddr = address.address;
		console.log(" - SERVIDOR TCP INICIADO - ");
		console.log("   El servidor esta escuchando : " + ipaddr + ":" + port);
		console.log(" - Esperando peticion del Cliente - ");
	});

	const sockets = [];
	server.on('connection', (sock) => {

		sockets.push(sock);
		// Recibimos el dato y enviamos
		sock.on('data', data => {
			// fecha
			// let fecha = new Date();
			// console.log( fecha.format("YYYY-MM-DD HH:mm:ss").toString() );
			console.log(`Mensaje recibido: ${data.toString()} de ${sock.remoteAddress}:${sock.remotePort}`);
			var datoRecibido = data.toString();
			const response = "Bienvenido al servidor -> " + datoRecibido + " " + getFecha();
			const dataBuffer = Buffer.from(response);

			// Escribe los datos a todos los conectados, el cliente los recibirá como datos del servidor
			sockets.forEach((sock, index, array) => {
				sock.write(dataBuffer);
				console.log("Dato enviado!!!");
			});
		});

		// Cerramos la conexion del socket
		sock.on('close', data => {
			let index = sockets.findIndex( o => {
				return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			});
			if (index !== -1) {
				sockets.splice(index, 1);
			}
		});
	});

	// Emite cuando existe algun error
	server.on('error', (error) => {
		console.log("error", error);
		server.close();
	});
}

function getFecha() {
    var fecha = new Date();
    mes = '' + (fecha.getMonth() + 1);
    dia = '' + fecha.getDate();
	anio = '' + fecha.getFullYear();
	hora = '' + fecha.getHours();
	min = '' + fecha.getMinutes();

    if (mes.length < 2)
        mes = '0' + mes;
    if (dia.length < 2)
		dia = '0' + dia;
	if (hora.length < 2)
		hora = '0' + hora;
	if (min.length < 2)
		min = '0' + min;

    return [anio, mes, dia].join('-') + " " + hora + ":" + min;
}
