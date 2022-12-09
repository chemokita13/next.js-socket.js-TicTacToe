import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
    return (
        <>
            {" "}
            <ToastContainer
                position="top-right"
                closeButton={false}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="bg-sky-900-trans"
                bodyClassName="text-center"
                progressClassName="bg-sky-400"
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
