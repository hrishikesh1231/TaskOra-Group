// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "./Landing_page/Home/HomePage";
// import "./index.css";
// import Navbar from "./Landing_page/Navbar";
// import GigSection from "./Landing_page/Gigs/GigSection";
// import Service from "./Landing_page/ServiceSection/Service";
// import { CityProvider } from "./context/CityContext";
// import PostGigForm from "./Landing_page/Posts/PostGigForm";
// import PostServiceForm from "./Landing_page/Posts/PostServiceForm";
// import SignUp from "./Registration/SignUp";
// import SignIn from "./Registration/SignIn";
// import { ToastContainer } from "react-toastify";
// import { Toaster } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";

// import { AuthProvider } from './context/AuthContext';
// import Footer from './Landing_page/Footer';
// import ApplyGigForm from './Landing_page/Apply/ApplyGigForm';
// import ApplicationHistory from './Landing_page/Apply/ApplicationHistory';
// import EditProfile from './Update_pro/EditProfile';
// import CategoryGigs from './Landing_page/Home/CategoryGigs';
// import MyGigsHistory from './Landing_page/Gigs/MyGigsHistory';
// import EditGigForm from './Landing_page/Gigs/EditGigForm';

// import ApplyServiceFrom from "./Landing_page/Apply/ApplyServiceFrom";

// import ServiceApplicationHistory from "./Landing_page/Apply/ServiceApplicationHistory";
// import ApplicantsList from "./Landing_page/Gigs/ApplicantList";
// import ScrollToTop from "./Landing_page/ScrollToTop";
// import OtpVerify from "./pages/OtpVerify";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//   <ScrollToTop/>
//   <CityProvider>
//     <AuthProvider>

//         <Navbar />
//         <ToastContainer position="top-center" autoClose={3000} />
//         <Toaster position="top-center" reverseOrder={false} />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/gigs/:city" element={<GigSection />} />
//           <Route path="/services/:city" element={<Service />} />
//           <Route path="/postGig" element={<PostGigForm />} />
//           <Route path="/postService" element={<PostServiceForm />} />
//           <Route path="/signUp" element={<SignUp />} />
//           <Route path="/login" element={<SignIn />} />

//           {/* Apply Routes */}
//           <Route path="/applyGig/:gigId" element={<ApplyGigForm />} />

//           <Route path='/update-profile' element={<EditProfile/>}></Route>
//           <Route path='/gigs/category/:category' element={<CategoryGigs />} />

//           <Route path='/my-gigs' element={<MyGigsHistory/>} />
//           <Route path="/edit-gig/:id" element={<EditGigForm/>} />
//           <Route path="/gig/:id/applicants" element={<ApplicantsList/>} />

//           {/* services */}
//           <Route path="/applyService/:serviceId" element={<ApplyServiceFrom />} />
//           <Route path="/service-applications" element={<ServiceApplicationHistory />}/>

//           <Route path="/applications" element={<ApplicationHistory />} />
//           <Route path="/update-profile" element={<EditProfile />} />
//           <Route path="/gigs/category/:category" element={<CategoryGigs />} />

//           {/* otp  */}
//           <Route path="/verify-otp" element={<OtpVerify />} />

//         </Routes>
//         <Footer />

//     </AuthProvider>
//     </CityProvider>
//   </BrowserRouter>
// );

// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import axios from "axios";

// import HomePage from "./Landing_page/Home/HomePage";
// import "./index.css";
// import Navbar from "./Landing_page/Navbar";
// import GigSection from "./Landing_page/Gigs/GigSection";
// import Service from "./Landing_page/ServiceSection/Service";
// import { CityProvider } from "./context/CityContext";
// import PostGigForm from "./Landing_page/Posts/PostGigForm";
// import PostServiceForm from "./Landing_page/Posts/PostServiceForm";
// import SignUp from "./Registration/SignUp";
// import SignIn from "./Registration/SignIn";
// import { ToastContainer } from "react-toastify";
// import { Toaster } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";

// import { AuthProvider } from "./context/AuthContext";
// import Footer from "./Landing_page/Footer";
// import ApplyGigForm from "./Landing_page/Apply/ApplyGigForm";
// import ApplicationHistory from "./Landing_page/Apply/ApplicationHistory";
// import EditProfile from "./Update_pro/EditProfile";
// import CategoryGigs from "./Landing_page/Home/CategoryGigs";
// import MyGigsHistory from "./Landing_page/Gigs/MyGigsHistory";
// import EditGigForm from "./Landing_page/Gigs/EditGigForm";
// import ApplyServiceFrom from "./Landing_page/Apply/ApplyServiceFrom";
// import ServiceApplicationHistory from "./Landing_page/Apply/ServiceApplicationHistory";
// import ApplicantsList from "./Landing_page/Gigs/ApplicantList";
// import ScrollToTop from "./Landing_page/ScrollToTop";
// import OtpVerify from "./pages/OtpVerify";

// /* ================= AXIOS GLOBAL CONFIG ================= */
// // ✅ MUST be AFTER imports, BEFORE render
// axios.defaults.baseURL = "http://localhost:3002";
// axios.defaults.withCredentials = true;
// /* ====================================================== */

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <BrowserRouter>
//     <ScrollToTop />
//     <CityProvider>
//       <AuthProvider>
//         <Navbar />

//         <ToastContainer position="top-center" autoClose={3000} />
//         <Toaster position="top-center" reverseOrder={false} />

//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           {/* <Route path="/gigs/:city" element={<GigSection />} /> */}
//           <Route path="/gigs" element={<GigSection />} />

//           {/* <Route path="/services/:city" element={<Service />} /> */}
//           <Route path="/services" element={<Service />} />

//           <Route path="/postGig" element={<PostGigForm />} />
//           <Route path="/postService" element={<PostServiceForm />} />
//           <Route path="/signUp" element={<SignUp />} />
//           <Route path="/login" element={<SignIn />} />

//           {/* Apply Routes */}
//           <Route path="/applyGig/:gigId" element={<ApplyGigForm />} />
//           <Route path="/applications" element={<ApplicationHistory />} />

//           <Route path="/my-gigs" element={<MyGigsHistory />} />
//           <Route path="/edit-gig/:id" element={<EditGigForm />} />
//           <Route path="/gig/:id/applicants" element={<ApplicantsList />} />

//           {/* Services */}
//           <Route path="/applyService/:serviceId" element={<ApplyServiceFrom />} />
//           <Route
//             path="/service-applications"
//             element={<ServiceApplicationHistory />}
//           />

//           <Route path="/update-profile" element={<EditProfile />} />
//           <Route path="/gigs/category/:category" element={<CategoryGigs />} />

//           {/* OTP */}
//           <Route path="/verify-otp" element={<OtpVerify />} />
//         </Routes>

//         <Footer />
//       </AuthProvider>
//     </CityProvider>
//   </BrowserRouter>
// );

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import HomePage from "./Landing_page/Home/HomePage";
import "./index.css";
import Navbar from "./Landing_page/Navbar";
import GigSection from "./Landing_page/Gigs/GigSection";
import Service from "./Landing_page/ServiceSection/Service";
import { CityProvider } from "./context/CityContext";
import PostGigForm from "./Landing_page/Posts/PostGigForm";
import PostServiceForm from "./Landing_page/Posts/PostServiceForm";
import SignUp from "./Registration/SignUp";
import SignIn from "./Registration/SignIn";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Footer from "./Landing_page/Footer";
import ApplyGigForm from "./Landing_page/Apply/ApplyGigForm";
import ApplicationHistory from "./Landing_page/Apply/ApplicationHistory";
import EditProfile from "./Update_pro/EditProfile";
import CategoryGigs from "./Landing_page/Home/CategoryGigs";
import MyGigsHistory from "./Landing_page/Gigs/MyGigsHistory";
import EditGigForm from "./Landing_page/Gigs/EditGigForm";
import ApplyServiceForm from "./Landing_page/Apply/ApplyServiceForm";
import ServiceApplicationHistory from "./Landing_page/Apply/ServiceApplicationHistory";
import MyServicesHistory from "./Landing_page/ServiceSection/MyServicesHistory";
import ApplicantsList from "./Landing_page/Gigs/ApplicantList";
import ScrollToTop from "./Landing_page/ScrollToTop";
import OtpVerify from "./pages/OtpVerify";
import EditServiceForm from "./Landing_page/ServiceSection/EditServiceForm";
import ServiceApplicantsList from "./Landing_page/ServiceSection/ServiceApplicantsList";
import { TokenProvider } from "./context/TokenContext";




/* ================= AXIOS GLOBAL CONFIG ================= */
axios.defaults.baseURL = "http://localhost:3002";
axios.defaults.withCredentials = true;
/* ====================================================== */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ScrollToTop />
    <CityProvider>
      <AuthProvider>
         <TokenProvider>
        <Navbar />

        <ToastContainer position="top-center" autoClose={3000} />
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* ✅ GIGS (NEW ARCHITECTURE) */}
          <Route path="/gigs" element={<GigSection />} />
          <Route path="/gigs/:city" element={<Navigate to="/gigs" replace />} />

          {/* ✅ SERVICES (MATCH GIGS) */}
          <Route path="/services" element={<Service />} />
          <Route
            path="/services/:city"
            element={<Navigate to="/services" replace />}
          />

          <Route path="/postGig" element={<PostGigForm />} />
          <Route path="/postService" element={<PostServiceForm />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />

          {/* Apply Routes */}
          <Route path="/applyGig/:gigId" element={<ApplyGigForm />} />
          <Route path="/applications" element={<ApplicationHistory />} />

          <Route path="/my-gigs" element={<MyGigsHistory />} />
          <Route path="/edit-gig/:id" element={<EditGigForm />} />
          <Route path="/gig/:id/applicants" element={<ApplicantsList />} />

          {/* Services */}
          {/* <Route
            path="/applyService/:serviceId"
            element={<ApplyServiceFrom />}
          /> */}
          <Route path="/applyService/:id" element={<ApplyServiceForm />} />

          <Route
            path="/service-applications"
            element={<ServiceApplicationHistory />}
          />
          <Route path="/my-services" element={<MyServicesHistory />} />
          <Route path="/edit-service/:id" element={<EditServiceForm />} />
          <Route
            path="/service/:id/applicants"
            element={<ServiceApplicantsList />}
          />

          <Route path="/update-profile" element={<EditProfile />} />
          <Route path="/gigs/category/:category" element={<CategoryGigs />} />

          {/* OTP */}
          <Route path="/verify-otp" element={<OtpVerify />} />
        </Routes>

        <Footer />
        </TokenProvider>
      </AuthProvider>
    </CityProvider>
  </BrowserRouter>,
);