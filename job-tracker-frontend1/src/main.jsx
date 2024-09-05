import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { DataContextProvider } from './useContext/DataContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/reports',
    element: <ReportPage />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataContextProvider>
      <RouterProvider router={router} />
    </DataContextProvider>
  </StrictMode>,
)
