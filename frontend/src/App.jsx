import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth, logoutUser } from "./authSlice"
import ProblemPage from "./pages/ProblemPage"
import CreateProblemPage from "./pages/CreateProblemPage"
import AdminPanel from "./pages/AdminPanel"
import ProblemManagement from "./admin/components/ProblemManagement"
import AdminDashboard from "./admin/components/AdminDashboard"
import CreateContestPage from "./pages/CreateContestPage"
import ContestsPage from "./pages/ContestsPage"
import ContestDetailPage from "./pages/ContestDetailPage"
import UserRoute from "./routes/UserRoute"
import ContestProblemPage from "./pages/ContestProblemPage"

function App() {

  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth());
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-green-300 text-sm font-mono">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={'/'} /> : <Login></Login>} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to={'/'} /> : <Signup></Signup>} />

        <Route path="/contest/:contestId/problem/:problemId" element={<ContestProblemPage />} />

        <Route path="/" element={<UserRoute />} >
          <Route path="/" element={isAuthenticated ? <HomePage></HomePage> : <Navigate to={'/login'} />} />
          <Route path="/problem/:id" element={isAuthenticated ? <ProblemPage></ProblemPage> : <Navigate to={'/login'} />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/contest/:contestId" element={<ContestDetailPage />} />
        </Route>


        <Route path="/admin" element={<AdminPanel />}>
          <Route path="admin-panel" element={<AdminDashboard />} />
          <Route path="create-problem" element={<CreateProblemPage />} />
          <Route path="create-contest" element={<CreateContestPage />} />
        </Route>



      </Routes>
    </>
  )
}

export default App
