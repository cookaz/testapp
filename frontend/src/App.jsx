import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import SearchResults from "./pages/SearchResults";
import BusinessProfile from "./pages/BusinessProfile";
import AddBusiness from "./pages/AddBusiness";
import AddReview from "./pages/AddReview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessModel from "./pages/BusinessModel";
import OwnerPreview from "./pages/OwnerPreview";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/business/:id/review" element={<AddReview />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/business-model" element={<BusinessModel />} />
            <Route path="/owner-preview" element={<OwnerPreview />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;