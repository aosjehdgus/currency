import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";

const basename = process.env.PUBLIC_URL;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <App>
          <Home />,
        </App>
      ),
    },
  ],
  { basename: basename }
);

export default router;
