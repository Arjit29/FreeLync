import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import Landing from './components/Landing/Landing.jsx'
import Register from './components/Register/Register.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Projects from './components/Projects/Projects.jsx'

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
    path: "/freelancer-projects",
    element: <Projects/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
