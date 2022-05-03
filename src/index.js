import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MoralisProvider
    appId="kwmPuGTZtcQZThf2XdILN7KxHRnpbUgqCnpKknEv"
    serverUrl="https://7le1uljg3khm.usemoralis.com:2053/server"
  >
    <App />
  </MoralisProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
