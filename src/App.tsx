import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { BalancePage } from './pages/BalancePage'
import { HomePage } from './pages/HomePage'
import { SubstitutionDemo2Page } from './pages/SubstitutionDemo2Page'
import { SubstitutionDemo3Page } from './pages/SubstitutionDemo3Page'
import { AppleTestPage } from './pages/AppleTestPage'
import { ShapesTestPage } from './pages/ShapesTestPage'
import { BalanceHookTestPage } from './pages/BalanceHookTestPage'
import { SubstitutionPage } from './pages/SubstitutionPage'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
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
          <Route path="test/apple" element={<AppleTestPage />} />
          <Route path="test/shapes" element={<ShapesTestPage />} />
          <Route path="test/balance-hook" element={<BalanceHookTestPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="reset-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/confirm" element={<ResetPasswordPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
