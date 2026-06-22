import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Inbox from "../pages/Inbox.tsx";
import Today from "../pages/Today.tsx";
import Projects from "../pages/Projects.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Inbox /> },
            { path: "/today", element: <Today /> },
            { path: "/projects", element: <Projects /> },
        ],
    },
]);