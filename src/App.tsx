import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BalancePage } from './pages/BalancePage'
import { HomePage } from './pages/HomePage'
import { SubstitutionDemo2Page } from './pages/SubstitutionDemo2Page'
import { SubstitutionDemo3Page } from './pages/SubstitutionDemo3Page'
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
          <Route path="substitution/2" element={<SubstitutionDemo2Page />} />
          <Route path="substitution/3" element={<SubstitutionDemo3Page />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
