import server from "./app.js";
import { Server as SocketServer } from "socket.io";
import tikTakToe from "./gameObject.js";

const io = new SocketServer(server, {
    cors: {
        origin: "*",
    },
}); // start socket.io server

let usersAndRooms = {}; //* {roomcode: {startedGame: Boolean, players: [p1, p2]}}

//TODO: Estas funciones pueden ser más optimizadas con  los if de 1 línea
const checkIfRoomExists = (roomCode) => {
    /* Check if a room allready exists */
    if (!usersAndRooms[roomCode]) {
        return false;
    } else {
        return true;
    }
};
//TODO: Comprobar si el socket.id está ya en la room o no (VER PRIMERO SI HACE FALTA O NO)
const checkIfRoomIsFilled = (roomCode) => {
    /* Check if a room allready is filled with the two players or not (A room cannot have more than two players)*/
    if (
        usersAndRooms[roomCode] &&
        usersAndRooms[roomCode].players.length >= 2 //! Realmente es necesario ese >= o solo con === 2 vale?
    ) {
        /// To avoid errors
        ///console.log(usersAndRooms[roomCode].players.length);
        return true;
    } else {
        console.log(usersAndRooms[roomCode].players.length);
        return false;
    }
};

/// Final del TODO

/* Socket.io listeners */
io.on("connection", (socket) => {
    console.log(`A new user connected, id: ${socket.id}`);
    //TODO: cuando la gente pida unirse a una room, verificar si ese código existe
    socket.on("code", (code) => {
        // console.log(code, socket.id);
        io.in(socket.id).emit("code", { code, id: socket.id }); // resend msg
        ///console.log(`Rooms: ${}`);
        // socket.rooms.forEach((element) => {
        //     console.log("e", element);
        // });
        // TODO: recorrer y ver la gente que hay en una room si fuera posible para comprobar si ya está llena con 2 personas antes de meter a nadie en ninguna room (MEDIO SOL EN LINEA 106)

        console.log("Exists: " + checkIfRoomExists(code));

        /* If room doesnt exists */
        if (!checkIfRoomExists(code)) {
            // Create a new room
            socket.join(code);
            socket.join(socket.id);
            usersAndRooms = {
                ...usersAndRooms,
                [code]: {
                    startedGame: false,
                    gameStartPetition: 0,
                    players: [socket.id],
                },
            };
            socket.to(socket.id).emit("code", { code, id: socket.id });
            console.log(`New room.\nRooms:  `, usersAndRooms);
        } else {
            /* If room allready exists */
            if (!checkIfRoomIsFilled(code)) {
                /* If room is not filled */
                usersAndRooms = {
                    ...usersAndRooms,
                    [code]: {
                        ...usersAndRooms[code],
                        players: [...usersAndRooms[code].players, socket.id],
                    },
                }; // Put the user into existing room
                socket.join(code);
                socket.join(socket.id);
                console.log(`New user added to room.\nRooms: `, usersAndRooms);
            } else {
                console.log("e 85"); //error in line 97 xd
            }
            if (
                usersAndRooms[code].players[0] ===
                usersAndRooms[code].players[1]
            ) {
                /* If room is filled with the same user. I DONT KNOW WHY HAPPENS BUT HAPPENS THAT */
                usersAndRooms = {
                    ...usersAndRooms,
                    [code]: {
                        ...usersAndRooms[code],
                        players: [usersAndRooms[code].players[0], socket.id],
                    },
                }; // Put the user into existing room
                socket.join(code);
                socket.join(socket.id);
                console.log(`New user added to room.\nRooms: `, usersAndRooms);
            }
        }
        //?console.log(usersAndRooms);
    });
    socket.on("gamePetition", (code) => {
        console.log(`Petition recieved with code: ${code}`);
        // if room doesnt exists
        if (!usersAndRooms[code]) {
            socket.to(socket.id).emit("error", "mising room");
            console.log(`emmited to: ${socket.id} the missing room error`);
            return;
        }
        // if game allready has started
        if (usersAndRooms[code].startedGame) {
            socket.to(socket.id).emit("warning", "game allready started");
            console.log(
                `emmited to: ${socket.id} the game allready started error`
            );
            return;
        }
        // if is the first petition
        if (usersAndRooms[code].gameStartPetition === 0) {
            io.in(code).emit("status", "waiting for other players...");
            usersAndRooms[code].gameStartPetition = 1;
            console.log(`emmited to: ${code} waiting for other player `);
            return;
        }
        // if is the second, and last, petition
        if (usersAndRooms[code].gameStartPetition === 1) {
            socket.to(socket.id).emit("status", "starting game...");
            console.log(`emmited to: ${socket.id} starting game`);
            usersAndRooms[code].gameStartPetition = 2;
            usersAndRooms[code].startedGame = true;
            usersAndRooms[code].game = new tikTakToe(
                usersAndRooms[code].players[0],
                usersAndRooms[code].players[1]
            );
            io.in(code).emit("haveToMove", {
                board: usersAndRooms[code].game.board,
                move: usersAndRooms[code].game.turnOf,
            });
            console.log(
                `emmited to: ${code} haveToMoveEvent.\n\tGame: `,
                usersAndRooms[code].game
            );

            return;
        }
    });
    //TODO: implementar diferencia entre error y warning
    socket.on("move", ({ code, coord }) => {
        console.log(`Move recieved with code: ${code} and coord: ${coord}`);
        if (
            // (usersAndRooms[code].players[0] === socket.id ||
            //     usersAndRooms[code].players[1] === socket.id) &&
            // usersAndRooms[code].startedGame
            usersAndRooms[code].game &&
            usersAndRooms[code].game.turnOf === socket.id // Verify if is the user's turn
        ) {
            console.log(11);
            const partyStatus = usersAndRooms[code].game.newMove(coord);
            if (partyStatus.win) {
                io.in(usersAndRooms[code].game.winner).emit("win", {
                    msg: "You win",
                    board: usersAndRooms[code].game.board,
                });
                io.in(usersAndRooms[code].game.looser).emit("win", {
                    msg: "You loose",
                    board: usersAndRooms[code].game.board,
                });
                console.log(
                    `win emmited to: ${code} with winner: ${usersAndRooms[code].game.winner}.\n\tGame: `,
                    usersAndRooms[code].game
                );
                console.log(`Going to delete: ${code}`);
                delete usersAndRooms[code];
                console.log(`Room ${code} deleted`);
                return;
            }
            if (partyStatus.error) {
                io.in(socket.id).emit("warning", "invalid move");
                console.log(`emmited to: ${socket.id} invalid move`);
                return;
            }
            if (partyStatus.tie) {
                io.in(code).emit("tie", {
                    msg: "Tie",
                    board: usersAndRooms[code].game.board,
                });
                console.log(
                    `tie emmited to: ${code}.\n\tGame: `,
                    usersAndRooms[code].game
                );
                console.log(`Going to delete: ${code}`);
                delete usersAndRooms[code];
                console.log(`Room ${code} deleted`);
                return;
            }
            io.in(code).emit("haveToMove", {
                board: usersAndRooms[code].game.board,
                move: usersAndRooms[code].game.turnOf,
            });
            console.log(
                `haveToMove emmited to: ${code} with mover: ${usersAndRooms[code].game.turnOf}.\n\tGame: `,
                usersAndRooms[code].game
            );
        } else {
            console.log("Is not our turn!"); /// only to debug
            io.to(socket.id).emit("warning", "It's not your turn!");
        }
    });
    socket.on("disconnecting", () => {
        socket.emit("user has left", socket.id);
        console.log(`User ${socket.id} has left`);
        Object.values(usersAndRooms).forEach((roomProps, index) => {
            if (
                roomProps.players[0] === socket.id ||
                roomProps.players[1] === socket.id
            ) {
                const roomCode = Object.keys(usersAndRooms)[index];

                io.to(roomCode).emit("error", "Someone leave the game.");
                console.log(`Someone leave the game in room: ${roomCode}`);
                io.in(roomCode).socketsLeave(roomCode);

                console.log(`Going to delete ${roomCode}`);
                delete usersAndRooms[roomCode];
                console.log("deleted");
            }
            //?socket.leave(Object.keys(usersAndRooms)[index]);
        });
        socket.leave(socket.id);
        console.log(`Rooms remaining: `, socket.rooms);
    });
});

export default server;
