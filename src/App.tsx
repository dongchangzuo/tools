import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const BalancePage = lazy(() => import('./pages/BalancePage').then((module) => ({ default: module.BalancePage })))
const SubstitutionPage = lazy(() => import('./pages/SubstitutionPage').then((module) => ({ default: module.SubstitutionPage })))
const SubstitutionDemo2Page = lazy(() => import('./pages/SubstitutionDemo2Page').then((module) => ({ default: module.SubstitutionDemo2Page })))
const SubstitutionDemo3Page = lazy(() => import('./pages/SubstitutionDemo3Page').then((module) => ({ default: module.SubstitutionDemo3Page })))
const AppleTestPage = lazy(() => import('./pages/AppleTestPage').then((module) => ({ default: module.AppleTestPage })))
const ShapesTestPage = lazy(() => import('./pages/ShapesTestPage').then((module) => ({ default: module.ShapesTestPage })))
const BalanceHookTestPage = lazy(() => import('./pages/BalanceHookTestPage').then((module) => ({ default: module.BalanceHookTestPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })))
const ResendActivationPage = lazy(() => import('./pages/ResendActivationPage').then((module) => ({ default: module.ResendActivationPage })))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
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
            <Route path="resend-activation" element={<ResendActivationPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
