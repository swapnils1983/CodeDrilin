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
import ProblemdetailPage from "./pages/ProblemdetailPage"
import DeleteProblem from "./pages/DeleteProblem"

function App() {

  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {

    dispatch(checkAuth());
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-green-400"></span>
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
          <Route path="/" element={<HomePage />} />
          <Route path="/problems" element={<ProblemPage />} />
          <Route path="/problem/:id" element={isAuthenticated ? <ProblemdetailPage></ProblemdetailPage> : <Navigate to={'/'} />} />
          <Route path="/contests" element={<ContestsPage />} />
          <Route path="/contest/:contestId" element={<ContestDetailPage />} />
        </Route>


        <Route path="/admin" element={<AdminPanel />}>
          <Route path="admin-panel" element={<AdminDashboard />} />
          <Route path="create-problem" element={<CreateProblemPage />} />
          <Route path="create-contest" element={<CreateContestPage />} />
          <Route path="delete-problem" element={<DeleteProblem />} />
        </Route>



      </Routes>
    </>
  )
}

export default App
