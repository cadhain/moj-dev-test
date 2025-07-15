import { StrictMode } from "react";
import App from "./App.tsx";
import "../govuk.scss";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
