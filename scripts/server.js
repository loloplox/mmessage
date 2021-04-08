const { Server }        = require("net");
const os                = require("os");

const END               = "END";

const ip                = () =>{
    const networkInterfaces = os.networkInterfaces()["Wi-Fi"];
    for (const networkInter of networkInterfaces) {
        if (networkInter.family == "IPv4") {
            let ipExtraida = networkInter.address;
            return ipExtraida;
        }
    }
}
const host              = ip();


// 127.0.0.1:8000 -> "lolo";
// 127.0.0.1:9000 -> "belo";
const conection     = new Map();

const error = (message) => {
    console.error(message);
    process.exit(1);
}

const sendMessage   = (message, origin) => {
    for (const socket of conection.keys()) {
        if (socket !== origin) {
            socket.write(message);
        }
    }
}

const listen = (port) => {
    const server        = new Server();

    server.on("connection", (socket) =>{

        const remoteSocket  = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log(`nueva coneccion en ${remoteSocket}`);
        socket.setEncoding("utf-8");

        socket.on("data", (message) =>{
            conection.values();

            if (!conection.has(socket)) {
                console.log(`Usuario: ${message} a establecido conexion desde ${remoteSocket}`);
                conection.set(socket, message);

            }else if(message === END){
                conection.delete(socket);
                socket.end();
            }else{
                const fullMessage = `[${conection.get(socket)}]: ${message}`;
                console.log(`${remoteSocket} => ${fullMessage}`);
                sendMessage(fullMessage, socket)
            }
        })

        socket.on("close", () =>{
            console.log(`la conexion de ${remoteSocket} a sido terminada`)
        })

        socket.on("error", (err) => error(err.message))
    })
    
    server.listen({port, host}, ()=>{
        console.log("escuchando en el puerto " + port);
        console.log(host);
    });

    server.on("error", (err) => error(err.message));
}

const main = () =>{
    if (process.argv.length !== 3) {
        error(`USO: node ${__filename} port`);
    }
    let port    = process.argv[2];
    if (isNaN(port)) {
        error(`puerto invalido ${port}`)
    }

    port = Number(port);
    listen(port);
}
if (require.main === module) {
    main();
}