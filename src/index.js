import React, { useReducer } from "react";
import { createRoot } from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./context/storeProvider";
import { AuthProvider } from "./context/auth";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreProvider userReducer={useReducer}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
