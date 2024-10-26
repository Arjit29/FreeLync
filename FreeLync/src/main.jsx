import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "./index.css"
import Landing from './components/Landing/Landing.jsx'

const router = createBrowserRouter([{
  path: "/",
  element: <Landing/>
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
