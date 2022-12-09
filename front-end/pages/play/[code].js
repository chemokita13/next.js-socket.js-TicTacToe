import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";

import { toast } from "react-toastify";

import { io } from "socket.io-client";
import { BACK_URL } from "../../config.js";

//console.log("using back port: ", BACK_URL);
const socket = io(BACK_URL);

function Code() {
    const router = useRouter();
    const { code } = router.query;

    const [gameBoard, setGameBoard] = useState([[], [], []]); // game board
    const [mySocketId, setMySocketId] = useState(""); // my socket.io id
    const [whoMoves, setWhoMoves] = useState(""); // who moves
    const [gameStarted, setGameStarted] = useState(false); // if the game started or not

    const returnXorOorSpace = ([x, y]) => {
        if (gameBoard && mySocketId) {
            if (gameBoard[x][y] === mySocketId) {
                return "X";
            } else if (gameBoard[x][y]) {
                return "O";
            } else {
                return " ";
            }
        } else {
            return "?";
        }
    };

    const handleMove = (coords) => {
        socket.emit("move", { coord: coords, code });
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
            setMySocketId(id);
        });
        socket.on("haveToMove", ({ board, move }) => {
            setGameStarted(true);
            setGameBoard(board);
            setWhoMoves(move);
            if (move === socket.id) {
                toast("Its your turn!", {
                    position: "top-center",
                    toastId: "Turn_id",
                    autoClose: 1000,
                });
            }
        });
        socket.on("status", (statusDescription) => {
            toast.info(statusDescription, { toastId: "Status_id" });
        });
        // If a warn ocurred the game can continue
        socket.on("warning", (warnDescription) => {
            toast.warn(warnDescription, {
                position: "top-center",
                toastId: "Warn_id",
            });
        });
        // If an error ocurred the game can not continue
        socket.on("error", (errorDescription) => {
            toast.error(errorDescription, {
                toastId: "Error_id",
            });
            router.push("/");
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
                setMySocketId(id);
            });
            socket.off("haveToMove", ({ board, move }) => {
                setGameStarted(true);
                setGameBoard(board);
                setWhoMoves(move);
                if (whoMoves === mySocketId) {
                    toast("Its your turn!", {
                        position: "top-center",
                        toastId: "Turn_id",
                        autoClose: 1000,
                    });
                }
            });
            socket.off("status", (statusDescription) => {
                toast.info(statusDescription, { toastId: "Status_id" });
            });
            socket.off("warning", (warnDescription) => {
                toast.warn(warnDescription, {
                    position: "top-center",
                    toastId: "Warn_id",
                });
            });
            socket.off("error", (errorDescription) => {
                toast.error(errorDescription, {
                    toastId: "Error_id",
                });
                router.push("/");
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
    });

    return (
        <div className="">
            <Head>
                <title>Playing</title>
            </Head>
            <div className="bg-sky-800 flex flex-col items-center h-screen">
                <div
                    className={`transition-transform duration-1000 ease-in-out sticky self-start text-sky-800 w-36 sm:w-52 mt-96 sm:mt-auto sm:my-auto p-5 sm:p-10 text-left bg-sky-100 border rounded-r-full border-sky-400 ${
                        !gameStarted && "translate-x-[-101%]"
                    }`}
                >
                    You: X
                    <br />
                    Opponent: O
                </div>

                <div
                    className={` transition-transform duration-1000 ease-in-out sticky self-start text-sky-800 w-60 sm:w-80 mt-[10vh] sm:mt-[-25vh] p-5 sm:p-10 text-left bg-sky-100 border rounded-r-full border-sky-400 ${
                        gameStarted && "translate-x-[-101%]"
                    }`}
                >
                    Share whit our friend the same url and both press:
                    &apos;Start game&apos;
                </div>

                <div className="absolute bg-sky-900 grid grid-rows-3 grid-cols-3 w-[270px] sm:w-[540px] h-[270px] sm:h-[540px] border rounded-xl p-5 gap-5  my-12 sm:my-16 border-sky-500 text-3xl sm:text-5xl text-center font-sans text-sky-600">
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="1"
                        onClick={() => handleMove([0, 0])}
                    >
                        {returnXorOorSpace([0, 0])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="2"
                        onClick={() => handleMove([0, 1])}
                    >
                        {returnXorOorSpace([0, 1])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="3"
                        onClick={() => handleMove([0, 2])}
                    >
                        {returnXorOorSpace([0, 2])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="4"
                        onClick={() => handleMove([1, 0])}
                    >
                        {returnXorOorSpace([1, 0])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="5"
                        onClick={() => handleMove([1, 1])}
                    >
                        {returnXorOorSpace([1, 1])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="6"
                        onClick={() => handleMove([1, 2])}
                    >
                        {returnXorOorSpace([1, 2])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="7"
                        onClick={() => handleMove([2, 0])}
                    >
                        {returnXorOorSpace([2, 0])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px]  m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="8"
                        onClick={() => handleMove([2, 1])}
                    >
                        {returnXorOorSpace([2, 1])}
                    </button>
                    <button
                        className="sm:p-5 w-[50px] sm:w-[100px] h-[50px] sm:h-[100px] m-auto border bg-sky-300 rounded-lg border-sky-400"
                        type="text"
                        name="9"
                        onClick={() => handleMove([2, 2])}
                    >
                        {returnXorOorSpace([2, 2])}
                    </button>
                </div>

                <button
                    className="p-2 sm:p-5 text-sky-800 w-[270px] sm:w-[540px] h-[40px] sm:h-[75px] mt-5 sm:mt-auto mb-52 sm:mb-auto sm:m-auto border border-sky-500 sm:text-xl rounded-full bg-sky-200 transition-transform duration-700 ease-in-out  hover:scale-105"
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
