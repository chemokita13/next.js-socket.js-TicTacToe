import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { BACK_URL } from "../config";

//console.log("using back port: ", BACK_URL);
const socket = io(BACK_URL + "/index");

export default function Home() {
    const router = useRouter();
    const [inputCodeValue, setInputCodeValue] = useState("");

    const handleSubmitButton = () => {
        if (
            inputCodeValue != "" &&
            !inputCodeValue.includes(" ") &&
            !inputCodeValue.includes("?") &&
            !inputCodeValue.includes("/") &&
            !inputCodeValue.includes(" ")
        ) {
            socket.emit("VerifyIfCanCreateARoom", inputCodeValue);
        } else {
            toast.warning("Code can not have special chars or be empty", {
                className: "w-[200%] bg-sky-900-trans items-center left-[-50%]",
                position: "top-center",
                toastId: "toastWarn",
            });
        }
    };

    useEffect(() => {
        socket.on("CanCreateARoom", ({ bool, code }) => {
            if (!bool) {
                toast.warning(`Code: ${code} is allready taken`, {
                    className:
                        "w-[200%] bg-sky-900-trans items-center left-[-50%]",
                    position: "top-center",
                    toastId: "toastWarn",
                });
            } else {
                router.push(`/play/${code}`);
            }
        });
        socket.on("info", (infoDes) => {
            toast.info(infoDes, {
                className: "w-[200%] bg-sky-900-trans items-center left-[-50%]",
                position: "top-center",
                toastId: "toastInfo",
            });
        });
    });

    return (
        <div className="bg-sky-800 h-screen w-screen flex flex-col justify-center">
            <Head>
                <title>Tik Tak Toe</title>
            </Head>

            <div className=" flex flex-col text-center items-center mb-72 cursor-default">
                <header className="bg-sky-900 w-[300px] xs:w-[400px] h-[150px] border rounded-xl border-sky-500 text-center font-sans text-sky-600 text-3xl xs:text-4xl font-extrabold m-3 flex items-center justify-center">
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 p-1 w-[75px] xs:w-[100px] h-[75px] xs:h-[100px]">
                        Tic
                    </div>
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 p-1 w-[75px] xs:w-[100px] h-[75px] xs:h-[100px]">
                        Tac
                    </div>
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 ml-3 p-1 w-[75px] xs:w-[100px] h-[75px] xs:h-[100px] -rotate-12">
                        <div className="rotate-12">Toe</div>
                    </div>
                </header>
                <input
                    type="text"
                    className="w-[75%] xs:w-1/2 m-2 placeholder:text-center placeholder:text-sky-700 p-1 rounded-xl bg-sky-300 text-center text-sky-600 font-semibold"
                    placeholder="Enter a code to create a room"
                    onChange={(e) => setInputCodeValue(e.target.value)}
                />
                <button
                    className="w-[200px] p-3 bg-sky-500 border border-sky-600 text-sky-200 font-extrabold m-1 rounded-full transition-transform duration-700 ease-in-out  hover:scale-105"
                    onClick={handleSubmitButton}
                >
                    Play
                </button>
            </div>
        </div>
    );
}
