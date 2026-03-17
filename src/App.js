import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyTasks from "./pages/DailyTasks";
import Calculator from "./pages/Calculator";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";

function App() {

return (

<AuthProvider>
<Router>

<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

<Navbar />


<Toaster position="top-right"/>
<div className="max-w-7xl mx-auto p-6">



<Routes>

{/* Public Routes */}

<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* Protected Routes */}

<Route
path="/calculator"
element={
<ProtectedRoute>
<Calculator />
</ProtectedRoute>
}
/>

<Route
path="/results"
element={
<ProtectedRoute>
<Results />
</ProtectedRoute>
}
/>

<Route
path="/dashboard"
element={
<ProtectedRoute>
<Dashboard />
</ProtectedRoute>
}
/>

<Route
path="/history"
element={
<ProtectedRoute>
<History />
</ProtectedRoute>
}
/>

<Route
path="/leaderboard"
element={
<ProtectedRoute>
<Leaderboard />
</ProtectedRoute>
}
/>

<Route
path="/profile"
element={
<ProtectedRoute>
<Profile />
</ProtectedRoute>
}
/>

<Route
path="/tasks"
element={
<ProtectedRoute>
<DailyTasks/>
</ProtectedRoute>
}
/>

</Routes>

</div>

</div>

</Router>
</AuthProvider>

);

}

export default App;