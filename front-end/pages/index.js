import Head from "next/head";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
    const [inputCodeValue, setInputCodeValue] = useState("");

    const handleSubmitButton = () => {
        if (inputCodeValue != "" && inputCodeValue.indexOf(" ") === 0) {
            console.log(8);
        } else {
            toast.warning("Code can not have spaces or be empty", {
                className: "w-[200%] bg-sky-900-trans items-center left-[-50%]",
                position: "top-center",
            });
        }
    };

    return (
        <div className="bg-sky-800 h-screen w-screen flex flex-col justify-center">
            <Head>
                <title>Tik Tak Toe</title>
            </Head>

            <div className=" flex flex-col text-center items-center mb-72 cursor-default">
                <header className="bg-sky-900 w-[400px] h-[150px] border rounded-xl border-sky-500 text-center font-sans text-sky-600 text-4xl font-extrabold m-3 flex items-center justify-center">
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 p-1 w-[100px] h-[100px]">
                        Tik
                    </div>
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 p-1 w-[100px] h-[100px]">
                        Tak
                    </div>
                    <div className="border bg-sky-300 rounded-lg border-sky-400 flex items-center justify-center m-1 ml-3 p-1 w-[100px] h-[100px] -rotate-12">
                        <div className="rotate-12">Toe</div>
                    </div>
                </header>
                <input
                    type="text"
                    className="w-1/2 m-2 placeholder:text-center placeholder:text-sky-700 p-1 rounded-xl bg-sky-300 text-center text-sky-600 font-semibold"
                    placeholder="Enter a code to share to your friend and start a party"
                />
                <button
                    className="w-[200px] p-3 bg-sky-500 border border-sky-600 text-sky-200 font-extrabold m-1 rounded-full"
                    onClick={handleSubmitButton}
                >
                    Play
                </button>
            </div>
        </div>
    );
}
