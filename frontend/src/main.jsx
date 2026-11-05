import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
            <Toaster />
        </Provider>
    </React.StrictMode>
);