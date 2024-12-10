import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css"
import Landing from './components/Landing/Landing.jsx'
import Register from './components/Register/Register.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

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
    path: "/dashboard",
    element: (
    <ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
