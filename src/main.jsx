import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage/AuthPage.jsx'
import './index.css'
import UserHome from './pages/Home/UserHome.jsx'
import AdminHome from './pages/Home/AdminHome.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='*' element={<NotFound />} />
      <Route path="/" element={<AuthPage />} />
      <Route path='/user/home' element={<UserHome />} />
      <Route path='/admin/home' element={<AdminHome />} />
    </Routes>
  </BrowserRouter>
)
