import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function Code() {
    const router = useRouter();
    const { code } = router.query;

    // TODO: arreglar los useState
    const [canMove, setCanMove] = useState(false); // if is the turn of the user ore not
    const [gameBoard, setGameBoard] = useState([[], [], []]);
    const [mySocketId, setMySocketId] = useState("");
    const [whoMoves, setWhoMoves] = useState(""); //!
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);

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
        //*if (canMove) {
        socket.emit("move", { coord: coords, code });
        setCanMove(false);
        //*}
    };

    const handleStartPetition = () => {
        socket.emit("gamePetition", code);
    };

    !gameEnded &&
        useEffect(() => {
            /* Only runs when page charge 1 time */
            if (code) {
                /* This run 2 times, first with code=null in hidratation reactjs and second with code=code working with nextjs */
                alert(code);
                socket.emit("code", code);
            }
        }, [code]);

    !gameEnded &&
        useEffect(() => {
            alert("updated");
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
                console.log("havetomove", board, move);
            });
            socket.on("status", (statusDescription) => {
                toast(statusDescription);
                console.log("status", statusDescription);
            });
            socket.on("error", (errorDescription) => {
                alert(errorDescription);
                console.error("error", errorDescription);
            });
            socket.on("win", ({ board, msg }) => {
                toast.success(msg);
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
                    console.log("havetomove", board, move);
                });
                socket.off("status", (statusDescription) => {
                    toast(statusDescription);
                    console.log("status", statusDescription);
                });
                socket.off("error", (errorDescription) => {
                    alert(errorDescription);
                    console.error("error", errorDescription);
                });
                socket.off("win", ({ board, msg }) => {
                    toast.success(msg);
                    router.push("/");
                });
            };
        }, []);

    return (
        <div className="">
            <div className="bg-sky-800 flex flex-col items-center h-screen">
                <div className="sticky self-start text-sky-800 w-52 my-auto p-10 text-left bg-sky-100 border rounded-r-full border-sky-400">
                    You: X
                    <br />
                    Opponent: O
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
                    className="p-5 text-sky-800 w-[540px] h-[75px]  m-auto border border-sky-500 text-xl rounded-full bg-sky-200"
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
