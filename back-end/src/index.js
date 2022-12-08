import server from "./socket.js";
import { BACK_PORT } from "./config.js";

server.listen(BACK_PORT, () =>
    console.log(`Server running on port: ${BACK_PORT}`)
);
