import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import Landing from './components/Landing/Landing.jsx'
import Register from './components/Register/Register.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Dashboard from './components/freelancer/Dashboard/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
// import Projects from './components/Projects/Projects.jsx'
import UserDashboard from './components/hirer/UserDashboard/UserDashboard.jsx'
import Explore from './components/freelancer/Explore/Explore.jsx';
import Project from './components/hirer/Project/Project.jsx';
import Projform from './components/hirer/Project/Projform.jsx';
import FreeLancerProject from './components/freelancer/FreeLancerProj/FreeLancerProj.jsx';
import Messages from './components/freelancer/Messages/Messages.jsx';
import ChatWindow from './components/freelancer/Messages/Chatwindow/Chatwindow.jsx';
import HirerMessages from './components/hirer/HirerMessages/HirerMessages.jsx';
import HirerChatWindow from './components/hirer/HirerMessages/HirerChatwindow/HirerChatwindow.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/signIn",
    element: <SignIn/>
  },
  {
    path: "/freelancer-dashboard",
    element: (
    <ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>
    )
  },
  {
    path: "/hirer-dashboard",
    element: (
    <ProtectedRoute>
      <UserDashboard/>
    </ProtectedRoute>
    )
  },
  {
    path: "/freelancer-explore",
    element: (
      <ProtectedRoute>
        <Explore/>
      </ProtectedRoute>
      )
  },
  {
    path: "/hirer-projects",
    element: (
      <ProtectedRoute>
        <Project/>
      </ProtectedRoute>
    )
  },
  {
    path: "/postnewjob",
    element: <Projform/>
  },
  {
    path: "/freelancer-projects",
    element: (
      <ProtectedRoute>
        <FreeLancerProject/>
      </ProtectedRoute>) 
  },
  {
    path: "/freelancer-messages",
    element: (
      <ProtectedRoute>
        <Messages/>
      </ProtectedRoute>
    )
  },
  {
    path: "/freelancer-chatwindow",
    element: (
      <ProtectedRoute>
        <ChatWindow/>
      </ProtectedRoute>
    )
  },
  {
    path: "/hirer-messages",
    element: (
      <ProtectedRoute>
        <HirerMessages/>
      </ProtectedRoute>
    )
  },
  {
    path: "/hirer-chatwindow",
    element: (
      <ProtectedRoute>
        <HirerChatWindow/>
      </ProtectedRoute>
    )
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
