import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <Home />,
      </App>
    ),
  },
]);

export default router;
