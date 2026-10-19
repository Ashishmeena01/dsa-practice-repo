
const net = require("node:net");

const PORT = 4000;
const AUTH_TOKEN = process.env.AUTH_TOKEN || "dev-token";

// Encode one protocol message:
// [4-byte length][JSON payload]
function encodeMessage(message) {
    const payload = Buffer.from(JSON.stringify(message), "utf8");
    const header = Buffer.alloc(4);

    header.writeUInt32BE(payload.length, 0);

    return Buffer.concat([header, payload]);
}

const server = net.createServer((socket) => {
    console.log("Client connected:", socket.remoteAddress);

    let buffer = Buffer.alloc(0);

    socket.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);

        // A TCP chunk may contain a partial message or many messages.
        while (buffer.length >= 4) {
            const length = buffer.readUInt32BE(0);

            // Reject invalid or excessively large payloads.
            if (length === 0 || length > 1024 * 1024) {
                socket.destroy(new Error("Invalid message length"));
                return;
            }

            // Wait until the entire payload has arrived.
            if (buffer.length < 4 + length) {
                break;
            }

            const payload = buffer.subarray(4, 4 + length);
            buffer = buffer.subarray(4 + length);

            let message;

            try {
                message = JSON.parse(payload.toString("utf8"));
            } catch {
                socket.write(
                    encodeMessage({ ok: false, error: "Invalid JSON" })
                );
                continue;
            }

            handleMessage(socket, message);
        }
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err.message);
    });

    socket.on("close", () => {
        console.log("Client disconnected");
    });
});

function handleMessage(socket, message) {
    // Validate the protocol version and message shape.
    if (
        !message ||
        typeof message !== "object" ||
        Array.isArray(message) ||
        message.version !== 1 ||
        typeof message.msg !== "string" ||
        typeof message.auth !== "string"
    ) {
        socket.write(
            encodeMessage({ ok: false, error: "Invalid protocol message" })
        );
        return;
    }

    // Authenticate the request.
    if (message.auth !== AUTH_TOKEN) {
        socket.write(
            encodeMessage({ ok: false, error: "Unauthorized" })
        );
        return;
    }

    // Handle supported operations.
    switch (message.msg) {
        case "hello":
            socket.write(
                encodeMessage({
                    ok: true,
                    version: 1,
                    reply: "Hello from MiniProtocol server!",
                })
            );
            break;

        case "ping":
            socket.write(
                encodeMessage({ ok: true, reply: "pong" })
            );
            break;

        default:
            socket.write(
                encodeMessage({ ok: false, error: "Unknown operation" })
            );
    }
}

server.listen(PORT, "127.0.0.1", () => {
    console.log(`MiniProtocol server listening on 127.0.0.1:${PORT}`);
});


export default buff;

let buff = Buffer.alloc(0)

buff = Buffer.from("aello","utf-8");

console.log(buff[0])