// import ReactDOM from 'react-dom/client';
// import {BrowserRouter,Routes,Route} from 'react-router-dom';
// import HomePage from './Landing_page/Home/HomePage';
// import './index.css';
// import Navbar from './Landing_page/Navbar';
// import GigSection from './Landing_page/Gigs/GigSection';
// import Service from './Landing_page/ServiceSection/Service';
// import { CityProvider } from './context/CityContext';
// import PostGigForm from './Landing_page/Posts/PostGigForm';
// import PostServiceForm from './Landing_page/Posts/PostServiceForm';
// import SignUp from './Registration/SignUp';
// import SignIn from './Registration/SignIn';
// import { ToastContainer } from "react-toastify";
// import { Toaster } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";
// import { AuthProvider } from './context/AuthContext';
// import Footer from './Landing_page/Footer';
// import ApplyGigForm from './Landing_page/Apply/ApplyGigForm';
// import ApplicationHistory from './Landing_page/Apply/ApplicationHistory';
// import EditProfile from './Update_pro/EditProfile';
// import CategoryGigs from './Landing_page/Home/CategoryGigs';
// import ApplyServiceFrom from './Landing_page/Apply/ApplyServiceFrom';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//   <AuthProvider>
//   <CityProvider>
//   <Navbar/>
//     <ToastContainer position="top-center" autoClose={3000} />
//     <Toaster position="top-center" reverseOrder={false} />
//     <Routes>
//       <Route path='/' element={<HomePage/>}></Route>
//       <Route path='/gigs/:city' element={<GigSection/>}></Route>
//       <Route path='/services/:city' element={<Service/>}></Route>
//       <Route path='/postGig' element={<PostGigForm/>}></Route>
//       <Route path='/postService' element={<PostServiceForm/>}></Route>
//       <Route path='/signUp' element={<SignUp/>}></Route>
//       <Route path='/login' element={<SignIn/>}></Route>

//       <Route path='/applyGig/:gigId' element={<ApplyGigForm/>}></Route>
//       <Route path='/applyService/:serviceId' element={<ApplyServiceFrom/>}></Route>
//       <Route path='/applications' element={<ApplicationHistory/>}></Route>

//       <Route path='/update-profile' element={<EditProfile/>}></Route>
//       <Route path='/gigs/category/:category' element={<CategoryGigs />} />

//     </Routes>
//     <Footer/>
//   </CityProvider>
//   </AuthProvider>
//   </BrowserRouter>
// );

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import { AuthProvider } from './context/AuthContext';
import Footer from './Landing_page/Footer';
import ApplyGigForm from './Landing_page/Apply/ApplyGigForm';
import ApplicationHistory from './Landing_page/Apply/ApplicationHistory';
import EditProfile from './Update_pro/EditProfile';
import CategoryGigs from './Landing_page/Home/CategoryGigs';
import MyGigsHistory from './Landing_page/Gigs/MyGigsHistory';
import EditGigForm from './Landing_page/Gigs/EditGigForm';

import ApplyServiceFrom from "./Landing_page/Apply/ApplyServiceFrom";

import ServiceApplicationHistory from "./Landing_page/Apply/ServiceApplicationHistory";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CityProvider>
        <Navbar />
        <ToastContainer position="top-center" autoClose={3000} />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gigs/:city" element={<GigSection />} />
          <Route path="/services/:city" element={<Service />} />
          <Route path="/postGig" element={<PostGigForm />} />
          <Route path="/postService" element={<PostServiceForm />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />

          {/* Apply Routes */}
          <Route path="/applyGig/:gigId" element={<ApplyGigForm />} />

          <Route path='/update-profile' element={<EditProfile/>}></Route>
          <Route path='/gigs/category/:category' element={<CategoryGigs />} />
    
          <Route path='/my-gigs' element={<MyGigsHistory/>} />
          <Route path="/edit-gig/:id" element={<EditGigForm/>} />


          {/* services */}
          <Route path="/applyService/:serviceId" element={<ApplyServiceFrom />} />
          <Route path="/service-applications" element={<ServiceApplicationHistory />}/>

          <Route path="/applications" element={<ApplicationHistory />} />
          <Route path="/update-profile" element={<EditProfile />} />
          <Route path="/gigs/category/:category" element={<CategoryGigs />} />
        </Routes>
        <Footer />
      </CityProvider>
    </AuthProvider>
  </BrowserRouter>
);
