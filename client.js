
const net = require("node:net");

const PORT = 4000;
const HOST = "127.0.0.1";
const AUTH_TOKEN = process.env.AUTH_TOKEN || "dev-token";

function encodeMessage(message) {
    const payload = Buffer.from(JSON.stringify(message), "utf8");
    const header = Buffer.alloc(4);
    header.writeUInt32BE(payload.length, 0);
    console.log(header);
    return Buffer.concat([header, payload]);
}

const socket = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log("Connected to MiniProtocol");

    socket.write(
        encodeMessage({
            version: 1,
            msg: "hello",
            auth: AUTH_TOKEN,
        })
    );
});



let buffer = Buffer.alloc(0);

socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

    while (buffer.length >= 4) {
        const length = buffer.readUInt32BE(0);

        if (length === 0 || length > 1024 * 1024) {
            console.error("Invalid response length");
            socket.destroy();
            return;
        }

        if (buffer.length < 4 + length) break;

        const payload = buffer.subarray(4, 4 + length);
        buffer = buffer.subarray(4 + length);

        try {
            const response = JSON.parse(payload.toString("utf8"));
            console.log("Server response:", response);
        } catch {
            console.error("Invalid JSON response");
        }
    }

    // This demo expects one response.
    socket.end();
});

socket.on("error", (err) => {
    console.error("Connection error:", err.message);
});

