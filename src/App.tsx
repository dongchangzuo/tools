import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './shared/ui/AppLayout'
import { ThemeProvider } from './shared/ui/ThemeContext'
import './App.css'

const HomePage = lazy(() => import('./features/home/HomePage').then((module) => ({ default: module.HomePage })))
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })))
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })))
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage').then((module) => ({ default: module.ResetPasswordPage })))
const ProfilePage = lazy(() => import('./features/auth/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })))
const ResendActivationPage = lazy(() => import('./features/auth/pages/ResendActivationPage').then((module) => ({ default: module.ResendActivationPage })))
const RectanglePerimeterPage = lazy(() =>
  import('./features/tools/rectangle-perimeter/pages/RectanglePerimeterPage').then((module) => ({
    default: module.RectanglePerimeterPage,
  })),
)
const RectanglePerimeterFormulaPage = lazy(() =>
  import('./features/tools/rectangle-perimeter-formula/pages/RectanglePerimeterFormulaPage').then((module) => ({
    default: module.RectanglePerimeterFormulaPage,
  })),
)
const RectanglePerimeterHalfPage = lazy(() =>
  import('./features/tools/rectangle-perimeter-half/pages/RectanglePerimeterHalfPage').then((module) => ({
    default: module.RectanglePerimeterHalfPage,
  })),
)

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="reset-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/confirm" element={<ResetPasswordPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="resend-activation" element={<ResendActivationPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tools/rectangle-perimeter" element={<RectanglePerimeterPage />} />
            <Route path="tools/rectangle-perimeter-formula" element={<RectanglePerimeterFormulaPage />} />
            <Route path="tools/rectangle-perimeter-half" element={<RectanglePerimeterHalfPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
