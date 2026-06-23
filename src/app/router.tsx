import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Inbox from "../pages/Inbox";
import Today from "../pages/Today";
import Projects from "../pages/Projects";
import Kanban from "../pages/Kanban";
import Calendar from "../pages/Calendar";
import TaskDetail from "../pages/TaskDetail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Inbox /> },
            { path: "/today", element: <Today /> },
            { path: "/projects/:projectId?", element: <Projects /> },
            { path: "/kanban", element: <Kanban /> },
            { path: "/calendar", element: <Calendar /> },
            { path: "/tasks/:taskId", element: <TaskDetail /> },
        ],
    },
]);