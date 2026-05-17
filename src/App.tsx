import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BalancePage } from './pages/BalancePage'
import { HomePage } from './pages/HomePage'
import { SubstitutionPage } from './pages/SubstitutionPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="balance" element={<BalancePage />} />
          <Route path="substitution" element={<SubstitutionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
