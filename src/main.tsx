import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { PrimeReactProvider } from "primereact/api";
import "./i18n.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={false}
          closeOnClick
          pauseOnHover
        />
      </PrimeReactProvider>
    </Provider>
  </React.StrictMode>
);
