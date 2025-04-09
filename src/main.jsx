import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NextActionProvider } from "./context/NextActionContext.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextActionProvider>
      <App />
    </NextActionProvider>
  </React.StrictMode>
);