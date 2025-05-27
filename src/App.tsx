import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import Login from './pages/login'
import Quiz from './pages/quiz'
import ProtectedRoute from './middlewares/ProtectedRoute'
import GuestRoute from './middlewares/GuestRoute'
import { AuthProvider } from './context/AuthContext'
import { QuizProvider } from './context/QuizContext'

function App() {
  return (
    <QuizProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<GuestRoute>
              <Login />
            </GuestRoute>} />
            <Route
              element={
                <ProtectedRoute />
              }
            >
              <Route path="/quiz/:id"
                element={<Quiz />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QuizProvider>
  )
}

export default App