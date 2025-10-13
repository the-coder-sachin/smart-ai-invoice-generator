import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/landingPages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Allinvoices from "./pages/invoices/Allinvoices";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";
import Dashboard from "./pages/dashboard/Dashboard";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* catch all the routes  */}
          <Route path="*" element={<Navigate to={"/"} replace />} />

          {/* protected routes  */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="invoices" element={<Allinvoices />} />
            <Route path="invoices/new" element={<CreateInvoice />} />
            <Route path="invoices/:id" element={<InvoiceDetails />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;
