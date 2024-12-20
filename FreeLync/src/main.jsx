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
import Projects from './components/Projects/Projects.jsx'
import UserDashboard from './components/hirer/UserDashboard/UserDashboard.jsx'
import Explore from './components/freelancer/Explore/Explore.jsx';
import Project from './components/hirer/Project/Project.jsx';
import Projform from './components/hirer/Project/Projform.jsx';

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
    element: <Projects/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
