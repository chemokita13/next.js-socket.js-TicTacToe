import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";

import { toast } from "react-toastify";

import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { forceNew: true });

function Code() {
    const router = useRouter();
    const { code } = router.query;

    // TODO: arreglar los useState
    const [canMove, setCanMove] = useState(false); // if is the turn of the user or not
    const [gameBoard, setGameBoard] = useState([[], [], []]);
    const [mySocketId, setMySocketId] = useState("");
    const [whoMoves, setWhoMoves] = useState(""); //!
    const [gameStarted, setGameStarted] = useState(false);

    const returnXorOorSpace = ([x, y]) => {
        console.log(gameBoard, mySocketId);
        if (gameBoard && mySocketId) {
            console.log(1);
            if (gameBoard[x][y] === mySocketId) {
                console.log(2, gameBoard[x][y]);
                return "X";
            } else if (gameBoard[x][y]) {
                console.log(3, gameBoard[x][y]);
                return "O";
            } else {
                console.log(4, gameBoard[x][y], gameBoard);
                return " ";
            }
        } else {
            return "?";
        }
    };

    const handleMove = (coords) => {
        //!
        //*if (canMove) {
        socket.emit("move", { coord: coords, code });
        setCanMove(false);
        //*}
    };

    const handleStartPetition = () => {
        socket.emit("gamePetition", code);
    };

    /// !gameEnded &&
    useEffect(() => {
        /* Only runs when page charge 1 time */
        /* But this run 2 times, first with code=null in hidratation reactjs and second with code=code working with nextjs I think this only happens in dev mode*/
        if (code) {
            socket.emit("code", code);
        }
    }, [code]);

    useEffect(() => {
        socket.on("code", ({ code, id }) => {
            console.log(`Code returned: ${code}`);
            setMySocketId(id);
            console.log("Socket id: " + id, mySocketId);
        });
        socket.on("haveToMove", ({ board, move }) => {
            setGameStarted(true);
            setGameBoard(board);
            //?alert(`Moves: ${move}`);
            setWhoMoves(move);
            if (move === socket.id) {
                toast("Its your turn!", {
                    position: "top-center",
                    toastId: "Turn_id",
                    autoClose: 1000,
                });
            }
            console.log("havetomove", move, socket.id);
        });
        socket.on("status", (statusDescription) => {
            toast.info(statusDescription, { toastId: "Status_id" });
            console.log("status", statusDescription);
        });
        // If a warn ocurred the game can continue
        socket.on("warning", (warnDescription) => {
            toast.warn(warnDescription, {
                position: "top-center",
                toastId: "Warn_id",
            });
            console.warn("warn", warnDescription);
        });
        // If an error ocurred the game can not continue
        socket.on("error", (errorDescription) => {
            toast.error(errorDescription, {
                toastId: "Error_id",
            });
            router.push("/");
            console.error("error", errorDescription);
        });
        socket.on("win", ({ board, msg }) => {
            toast.success(msg, { toastId: "Win_id" });
            router.push("/");
        });
        socket.on("tie", ({ msg, board }) => {
            toast("Tie!", { toastId: "Tie_id" });
            router.push("/");
        });
        return () => {
            socket.off("code", ({ code, id }) => {
                console.log(`Code returned: ${code}`);
                setMySocketId(id);
                console.log("Socket id: " + id, mySocketId);
            });
            socket.off("haveToMove", ({ board, move }) => {
                setGameStarted(true);
                setGameBoard(board);
                //?alert(`Moves: ${move}`);
                setWhoMoves(move);
                if (whoMoves === mySocketId) {
                    toast("Its your turn!", {
                        position: "top-center",
                        toastId: "Turn_id",
                        ///autoClose: 1000,
                    });
                }
                console.log("havetomove", board, move);
            });
            socket.off("status", (statusDescription) => {
                toast.info(statusDescription, { toastId: "Status_id" });
                console.log("status", statusDescription);
            });
            socket.off("warning", (warnDescription) => {
                toast.warn(warnDescription, {
                    position: "top-center",
                    toastId: "Warn_id",
                });
                console.warn("warn", warnDescription);
            });
            socket.off("error", (errorDescription) => {
                toast.error(errorDescription, {
                    toastId: "Error_id",
                });
                router.push("/");
                console.error("error", errorDescription);
            });
            socket.off("win", ({ board, msg }) => {
                toast.success(msg, { toastId: "Win_id" });
                router.push("/");
            });
            socket.off("tie", ({ msg, board }) => {
                toast("Tie!", { toastId: "Tie_id" });
                router.push("/");
            });
        };
    }, []);

    return (
        <div className="">
            <Head>
                <title>Playing</title>
            </Head>
            <div className="bg-sky-800 flex flex-col items-center h-screen">
                <div
                    className={`transition-transform duration-1000 ease-in-out sticky self-start text-sky-800 w-52 my-auto p-10 text-left bg-sky-100 border rounded-r-full border-sky-400 ${
                        !gameStarted && "translate-x-[-101%]"
                    }`}
                >
                    You: X
                    <br />
                    Opponent: O
                </div>

                <div
                    className={` transition-transform duration-1000 ease-in-out sticky self-start text-sky-800 w-80 mt-[-25vh] p-10 text-left bg-sky-100 border rounded-r-full border-sky-400 ${
                        gameStarted && "translate-x-[-101%]"
                    }`}
                >
                    Share whit our friend the same url and both press: 'Start
                    game'
                </div>

                <div className="absolute bg-sky-900 grid grid-rows-3 grid-cols-3 w-[540px] h-[540px] border rounded-xl p-5 gap-5  my-16 border-sky-500 text-5xl text-center font-sans text-sky-600">
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="1"
                        onClick={() => handleMove([0, 0])}
                    >
                        {returnXorOorSpace([0, 0])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="2"
                        onClick={() => handleMove([0, 1])}
                    >
                        {returnXorOorSpace([0, 1])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="3"
                        onClick={() => handleMove([0, 2])}
                    >
                        {returnXorOorSpace([0, 2])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="4"
                        onClick={() => handleMove([1, 0])}
                    >
                        {returnXorOorSpace([1, 0])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="5"
                        onClick={() => handleMove([1, 1])}
                    >
                        {returnXorOorSpace([1, 1])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="6"
                        onClick={() => handleMove([1, 2])}
                    >
                        {returnXorOorSpace([1, 2])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="7"
                        onClick={() => handleMove([2, 0])}
                    >
                        {returnXorOorSpace([2, 0])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="8"
                        onClick={() => handleMove([2, 1])}
                    >
                        {returnXorOorSpace([2, 1])}
                    </button>
                    <button
                        className="p-5 w-[100px] h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="9"
                        onClick={() => handleMove([2, 2])}
                    >
                        {returnXorOorSpace([2, 2])}
                    </button>
                </div>

                <button
                    className="p-5 text-sky-800 w-[540px] h-[75px]  m-auto border border-sky-500 text-xl rounded-full bg-sky-200 transition-transform duration-700 ease-in-out  hover:scale-105"
                    onClick={handleStartPetition}
                    disabled={gameStarted}
                >
                    {gameStarted
                        ? `Moves: ${
                              whoMoves === mySocketId
                                  ? "You"
                                  : "The other player"
                          }`
                        : "Start game"}
                </button>
            </div>
        </div>
    );
}

export default Code;
