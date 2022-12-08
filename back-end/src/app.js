import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";

/* Inits */

const app = express(); // express init

const server = http.createServer(app); // http new server because with socket.io cannot use app.listen()

/* Middlewares */
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

export default server;
