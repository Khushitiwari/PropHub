
import { Routes , Route } from "react-router-dom";
import LandingPage from './pages/shared/LandingPage.jsx';
import Properties from "./pages/shared/Properties.jsx";
import PropertyDetails from "./pages/shared/PropertyDetails.jsx";
import Register from "./pages/auth/Register.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPasssword from "./pages/auth/ForgotPasssword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Profile from "./pages/shared/Profile.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import SellerRequests from "./pages/admin/SellerRequests.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminContact from "./pages/admin/AdminContact.jsx";

const App = () => {
  return (
    <div>

      <Routes>
        <Route path="/register" element={ <Register/> } />
        <Route path="/login" element={ <Login/> } />
        <Route  path="/verify-email"  element={<VerifyEmail/>} />
        <Route path="/forgot-password" element={ <ForgotPasssword /> }
         />
         <Route path="/profile" element={<Profile/> } /> 
         <Route path="/reset-password/:token" element={ <ResetPassword />} />
        <Route path="/" element={ <LandingPage/> } />
        <Route path="/properties" element={ <Properties /> } />
        <Route path="/property/:id" element={ <PropertyDetails/> }/>

        < Route element={<AdminLayout/> } >
         <Route path="/admin-dashboard" element={< AdminDashboard/> }/> 
         <Route path="admin/users" element={<AdminUsers />} />
         <Route path="/admin/seller-requests"  element={< SellerRequests/> }  />
         <Route path="/admin/properties" element={< AdminProperties/>} />
         <Route path="/admin/inquiries" element={<AdminInquiries />} />
         <Route path="/admin/contacts"  element={< AdminContact/> } />
         </ Route>

      </Routes>

    </div>
    
  )
}

export default App
