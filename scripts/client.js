const { Socket }    = require("net");
const readline      = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
})
const chat          = document.getElementById("chat")

const END       = "END";

const error = (message) => {
    console.error(message);
    process.exit(1);
}

const connect = (host, port) => {
    console.log(`intentando conectar a ${host}:${port}`);

    const socket    = new Socket();

    socket.connect({host, port});

    socket.setEncoding("utf-8");

    socket.on("connect", () =>{
        console.log("conectado")

        readline.question("Ingrese un nombre de usuario: ", (username) => {
            socket.write(username);
            console.log("escribe cualquier mensaje para mandarlo, o escrive 'END' para salir.");
        })

        readline.on("line", (message) =>{
            socket.write(message);
            if(message === END){
                socket.end();
            }
        })
    
        socket.on("data", (data) =>{
            console.log(data);
        })

    })

    socket.on("close", () =>{
        console.log("Desconectado");
        process.exit(0);
    })

    socket.on("error", (err) => error(err.message));
}

const main = () => {
    if (process.argv.length !== 4) {
        error(`USO: node ${__filename} host port`);
    }

    let [ , , host, port] = process.argv;

    if (isNaN(port)) {
        error(`puerto invalido ${port}`);
    }
    
    port = Number(port);
    connect(host, port);
}

if (require.main === module) {
    main();
}