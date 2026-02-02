// require('dotenv').config(); //env 

// // location 


// const locationRoutes = require("./routes/locationRoutes");

// //
// const express = require('express');
// const mongoose = require('mongoose');
// const { Gig } = require('./models/Gigmodel');
// const { gigsData } = require('./Data/GigsData');

// const app = express();

// const cors = require('cors');
// const { Service } = require('./models/Servicemodel');
// const { servicesData } = require('./Data/ServiceData');

// const session = require('express-session');
// const MongoStore = require('connect-mongo'); //session store on deployment
// const passport = require('passport');//3 types 2 here 1 in modeluser
// const LocalStrategy = require('passport-local');

// const bodyParser = require('body-parser');
// const { UserModel } = require('./models/UserModel');
// const WrapAsync = require('./utils/WrapAsync');
// const { isLoggedIn } = require('./middlewares/middleware');
// const axios = require("axios");

// const multer = require("multer");
// const path = require("path");
// const { upload } = require('./utils/Cloudinary');
// const { Application } = require('./models/ApplicationModel');

// // services
// const { ServiceApplication } = require("./models/ServiceApplicationModel");


// const url = process.env.MONGO_URL;
// const PORT = process.env.PORT || 3002;
// const secret = process.env.SECRET;

// const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000"; // Python FastAPI service


// app.use(express.json());

// //
// app.use(express.urlencoded({ extended: true }));


// app.use(cors({
//     origin: 'http://localhost:3000', // your React dev URL
//     // methods: ['GET', 'POST'],
//     credentials: true
// }));

// app.set("trust proxy", 1);

// //mogno store
// const store =MongoStore.create({
//     mongoUrl:url,
//     crypto: {
//         secret: secret,
//     },
//     touchAfter:24*3600,
// })
// //if error
// store.on("error",()=>{
//     console.log("Error in Mongo Session Store",err);

// })
// const sessionOption = {
//   store,
//   secret: secret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,   // ✅ must be false on localhost
//     sameSite: "lax", // ✅ fixes cookie being blocked
//     httpOnly: true,
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   },
// };


// //session
// app.use(session(sessionOption));

// //passport //read documentation //for creatig user
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(UserModel.authenticate()))
// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());


// app.get('/app',(req,res)=>{
//     res.send("working sdgv");
// });


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure uploads/ exists in backend root
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// // const upload = multer({ storage });



// app.post('/dummy1', WrapAsync(async (req, res) => {
//   try {
//     await Gig.deleteMany({}); // clear old data
//     const inserted = await Service.insertMany(servicesData);
//     res.send("Seed success");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error seeding data");
//   }
// }));

// //new Gig post
// // New Gig post with AI moderation
// // GIGS
// // New Gig post with AI moderation
// app.post('/addGig', isLoggedIn, async (req, res) => {
//   try {
//     const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, req.body);

//     if (aiRes.data.status === "ok") {
//       const newGig = new Gig({
//         ...req.body,
//         postedBy: req.user._id // ✅ store user’s ObjectId
//       });

//       await newGig.save();
//       return res.status(201).json({ message: "✅ Gig created successfully", gig: newGig });
//     }

//     return res.status(400).json({ error: aiRes.data.message });

//   } catch (err) {
//     if (err.response && err.response.data) {
//       return res.status(err.response.status || 400).json({
//         error: err.response.data.message || "Rejected by AI validation"
//       });
//     }
//     console.error("Error in /addGig:", err);
//     res.status(500).json({ error: "Server error while creating gig" });
//   }
// });

// // SERVICES
// app.post("/addService", isLoggedIn, async (req, res) => {
//   try {
//     let { title, description, salary, location, postedBy, contact, date } = req.body;

//     // 1️⃣ Ensure correct date format (YYYY-MM-DD)
//     let isoDate = null;
//     if (date) {
//       const parsed = new Date(date);
//       if (!isNaN(parsed.getTime())) {
//         isoDate = parsed.toISOString().split("T")[0]; // force ISO date
//       }
//     }

//     // 2️⃣ Clean salary (remove ₹, numbers, and special chars for AI moderation)
//     const cleanSalary = salary ? salary.toString().replace(/[^a-zA-Z\s]/g, "").trim() : "";

//     // 3️⃣ Clean contact (only keep digits, allow +91 format)
//     let cleanContact = contact ? contact.toString().trim() : "";
//     if (cleanContact.startsWith("+")) {
//       cleanContact = "+" + cleanContact.replace(/\D/g, "");
//     } else {
//       cleanContact = cleanContact.replace(/\D/g, "");
//     }

//     // 4️⃣ Debug log (check payload being sent to FastAPI)
//     console.log("📤 Sending to FastAPI /analyze_service:", {
//       title,
//       description,
//       salary: cleanSalary,
//       location,
//       postedBy,
//       contact: cleanContact,
//       date: isoDate,
//     });

//     // 5️⃣ Call FastAPI moderation
//     const aiResponse = await axios.post(`${FASTAPI_URL}/analyze_service`, {
//       title,
//       description,
//       salary: cleanSalary,
//       location,
//       postedBy,
//       contact: cleanContact,
//       date: isoDate,
//     });

//     // 6️⃣ If safe → save in MongoDB (store original values for salary/date)
//     if (aiResponse.data.status === "ok") {
//       const newService = new Service({
//         title,
//         description,
//         salary, // store raw salary (e.g. ₹12000/month)
//         location,
//         postedBy,
//         contact, // store raw contact
//         date: new Date(date), // store raw date
//       });

//       await newService.save();
//       return res.status(201).json({ message: "Service created successfully ✅", service: newService });
//     }

//     return res.status(400).json({ error: aiResponse.data.message });

//   } catch (err) {
//     if (err.response && err.response.data) {
//       return res.status(err.response.status || 400).json({
//         error: err.response.data.message || "Rejected by AI validation",
//       });
//     }

//     console.error("❌ Error in /addService:", err.message);
//     res.status(500).json({ error: "Failed to create service" });
//   }
// });




// // app.get('/getGigs',WrapAsync(async(req,res)=>{
// //     try{
// //         let allGigs = await Gig.find({});
// //         res.json(allGigs);
// //     }catch(err){
// //         console.log(err);
// //     }
// // }))
// // backend: filter gigs by city
// app.get('/getGigs/:city', WrapAsync(async (req, res) => {
//   try {
//     const city = req.params.city;

//     // ✅ Populate postedBy with username + email
//     let gigs = await Gig.find({ location: { $regex: new RegExp(city, "i") } })
//       .populate("postedBy", "username email");

//     res.json(gigs);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server Error");
//   }
// }));


// app.get('/getService/:city', WrapAsync(async(req,res)=>{
//     try{
//         const { city } = req.params;
//         let allService = await Service.find({ location: new RegExp(`^${city}$`, "i") }); 
//         res.json(allService);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }));




// //user authentication
// app.post("/signUp",WrapAsync(async(req,res,next)=>{
//     // let hashedPassword = await bcrypt.hash(req.body.password,10);
//     // console.log(hashedPassword);
//         let newUser = UserModel({
//         username:req.body.name,
//         email:req.body.email,
//         // password:hashedPassword,
//         });
//         let user = await UserModel.register(newUser,req.body.password);
//         req.login(user, (err) => {
//         if(err) {
//            return next(err);
//         }else{
//             res.send("done");
//         }
//         });
//     // } catch (error) {
//     //     throw new ExpressError(404,error.message); //no use //try catch stops crash
//     // }
// }));

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     // failureFlash: true,
//   }),
//   WrapAsync(async (req, res) => {
//     res.json({
//       msg: "Login successful",
//       user: { username: req.user.username },
//     });
//   }
// ));


// app.get("/current-user", (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.status(200).json({
//             success: true,
//             user: req.user, // Passport automatically attaches user to req
//         });
//     } else {
//         return res.status(401).json({ success: false, message: "Not logged in" });
//     }
// });


// // LOGOUT ROUTE
// app.get("/logout", (req, res) => {
//     req.logout(function(err) {
//         if (err) {
//             return res.status(500).json({ success: false, message: "Logout failed" });
//         }
//         // Destroy session after logout
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({ success: false, message: "Session destroy failed" });
//             }

//             res.clearCookie("connect.sid"); // Important: Clears session cookie
//             return res.status(200).json({ success: true, message: "Logged out successfully" });
//         });
//     });
// });

// //post application form
// app.post("/applyGig/:gigId", isLoggedIn, upload.array("pictures", 5), async (req, res) => {
//   try {
//     const { name, message, contact, charges } = req.body;

//     const application = new Application({
//       gig: req.params.gigId,
//       applicant: req.user._id,
//       name,
//       message,
//       contact,
//       charges,
//       // ✅ Cloudinary stores URLs in req.files
//       pictures: req.files.map((file) => file.path), 
//     });

//     await application.save();
//     res.status(201).json({ message: "Application submitted successfully ✅" });
//   } catch (err) {
//     console.error("❌ Error in /applyGig:", err);
//     res.status(500).json({ error: "Failed to apply", details: err.message });
//   }
// });


// //get task appiled history
// app.get("/my-applications", isLoggedIn, async (req, res) => {
//   // console.log(req.user);
//   try {
//     const apps = await Application.find({ applicant: req.user._id })
//       .populate("gig", "title location date category")  // show gig info
//       .sort({ createdAt: -1 }); // latest first

//     res.json(apps);
//   } catch (err) {
//     console.error("❌ Error fetching applications:", err);
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

// app.use("/api", locationRoutes);

// //

// // services

// app.post("/applyService/:serviceId", isLoggedIn, upload.array("pictures", 5), async (req, res) => {
//   try {
//     const { name, message, contact, charges } = req.body;

//     const application = new ServiceApplication({
//       service: req.params.serviceId,
//       applicant: req.user._id,
//       name,
//       message,
//       contact,
//       charges,
//       pictures: req.files.map((file) => file.path), // Cloudinary URLs
//     });

//     await application.save();
//     res.status(201).json({ message: "✅ Service application submitted successfully" });
//   } catch (err) {
//     console.error("❌ Error in /applyService:", err);
//     res.status(500).json({ error: "Failed to apply for service", details: err.message });
//   }
// });

// app.get("/my-service-applications", isLoggedIn, async (req, res) => {
//   try {
//     const apps = await ServiceApplication.find({ applicant: req.user._id })
//       .populate("service", "title description location date salary contact postedBy") // include more fields
//       .sort({ createdAt: -1 });

//     res.json(apps);
//   } catch (err) {
//     console.error("❌ Error fetching service applications:", err);
//     res.status(500).json({ error: "Failed to fetch service applications" });
//   }
// });





// // popular categories

// // ✅ Get gigs by category
// app.get('/getGigsByCategory/:category', WrapAsync(async (req, res) => {
//   try {
//     const category = req.params.category;
//     let gigs = await Gig.find({ category: { $regex: new RegExp(category, "i") } });
//     res.json(gigs);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server Error" });
//   }
// }));


// //my gigs-history
// // backend/index.js
// app.get("/my-gigs", isLoggedIn, async (req, res) => {
//   try {
//     const gigs = await Gig.find({ postedBy: req.user._id })
//       .sort({ createdAt: -1 }); // latest first

//     res.json(gigs);
//   } catch (err) {
//     console.error("❌ Error fetching user gigs:", err);
//     res.status(500).json({ error: "Failed to fetch your gigs" });
//   }
// });
// // Edit Gig (with AI moderation)
// app.put("/gig/:id", isLoggedIn, async (req, res) => {
//   try {
//     // 🔎 Call FastAPI moderation first
//     const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, req.body);

//     if (aiRes.data.status !== "ok") {
//       return res.status(400).json({ error: aiRes.data.message });
//     }

//     // ✅ Update gig if safe
//     const updatedGig = await Gig.findOneAndUpdate(
//       { _id: req.params.id, postedBy: req.user._id }, // only allow owner to update
//       req.body,
//       { new: true }
//     );

//     if (!updatedGig) {
//       return res.status(404).json({ error: "Gig not found or not authorized ❌" });
//     }

//     res.status(200).json({ message: "✅ Gig updated successfully", gig: updatedGig });
//   } catch (err) {
//     console.error("❌ Error updating gig:", err);
//     if (err.response?.data) {
//       return res.status(400).json({ error: err.response.data.message });
//     }
//     res.status(500).json({ error: "Server error while updating gig" });
//   }
// });


// app.get("/gig/:id", isLoggedIn, async (req, res) => {
//   try {
//     const gig = await Gig.findOne({
//       _id: req.params.id,
//       postedBy: req.user._id, // ✅ only your own gigs
//     });
//     if (!gig) return res.status(404).json({ error: "Gig not found ❌" });
//     res.json(gig);
//   } catch (err) {
//     console.error("❌ Error fetching gig:", err);
//     res.status(500).json({ error: "Failed to fetch gig" });
//   }
// });

// //delete functionality
// // Delete Gig (only owner can delete)
// app.delete("/gig/:id", isLoggedIn, async (req, res) => {
//   try {
//     const deletedGig = await Gig.findOneAndDelete({
//       _id: req.params.id,
//       postedBy: req.user._id, // only allow the owner to delete
//     });

//     if (!deletedGig) {
//       return res.status(404).json({ error: "Gig not found or not authorized ❌" });
//     }

//     res.status(200).json({ message: "✅ Gig deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting gig:", err);
//     res.status(500).json({ error: "Server error while deleting gig" });
//   }
// });





// app.listen(PORT,()=>{
//     console.log("App started!")
//     //mono connecct
//     mongoose.connect(url);
//     console.log("DB connected..")
// }) 


// /// gig view applicants
// // GET applicants for a gig (only owner)
// app.get("/gig/:id/applicants", isLoggedIn, async (req, res) => {
//   try {
//     // console.log("hell");
//     // verify the gig belongs to the logged-in user
//     const gig = await Gig.findById(req.params.id);
//     if (!gig) return res.status(404).json({ error: "Gig not found" });
//     if (String(gig.postedBy) !== String(req.user._id)) {
//       return res.status(403).json({ error: "Not authorized to view applicants" });
//     }

//     // fetch applications for this gig, populate applicant basic info
//     const apps = await Application.find({ gig: req.params.id })
//       .populate("applicant", "username email") // add any fields you want
//       .sort({ createdAt: -1 });

//     res.json({ count: apps.length, applications: apps });
//   } catch (err) {
//     console.error("❌ Error fetching applicants:", err);
//     res.status(500).json({ error: "Failed to fetch applicants" });
//   }
// });





// require("dotenv").config(); // env

// // ================= IMPORTS =================
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const axios = require("axios");
// const multer = require("multer");
// const nodemailer = require("nodemailer");

// // ================= MODELS =================
// const { Gig } = require("./models/Gigmodel");
// const { Service } = require("./models/Servicemodel");
// const { UserModel } = require("./models/UserModel");
// const { Application } = require("./models/ApplicationModel");
// const { ServiceApplication } = require("./models/ServiceApplicationModel");
// const Otp = require("./models/OtpModel");

// // ================= UTILS =================
// const WrapAsync = require("./utils/WrapAsync");
// const { isLoggedIn } = require("./middlewares/middleware");
// const { upload } = require("./utils/Cloudinary");

// // ================= ROUTES =================
// const locationRoutes = require("./routes/locationRoutes");

// const app = express();

// // ================= ENV =================
// const url = process.env.MONGO_URL;
// const PORT = process.env.PORT || 3002;
// const secret = process.env.SECRET;
// const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

// // ================= BODY PARSER (MUST BE FIRST) =================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ================= CORS =================
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.set("trust proxy", 1);

// // ================= SESSION =================
// const store = MongoStore.create({
//   mongoUrl: url,
//   crypto: { secret },
//   touchAfter: 24 * 3600,
// });

// app.use(
//   session({
//     store,
//     secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       sameSite: "lax",
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     },
//   })
// );

// // ================= PASSPORT =================
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(UserModel.authenticate()));
// passport.serializeUser(UserModel.serializeUser());
// passport.deserializeUser(UserModel.deserializeUser());

// // ================= EMAIL SETUP =================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ================= TEST EMAIL =================
// app.post("/send-test-email", async (req, res) => {
//   try {
//     const email = req.body?.email;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     await transporter.sendMail({
//       from: `"TaskOra" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Test Email",
//       text: "This email is sent to YOUR email.",
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Email error:", err);
//     res.status(500).json({ success: false });
//   }
// });

// // ================= SEND OTP =================
// app.post("/send-otp", async (req, res) => {
//   try {
//     const email = req.body?.email;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // DEBUG
//     console.log("📩 SENDING OTP:", otp, "TO:", email);

//     await Otp.deleteMany({ email });

//     await Otp.create({
//       email,
//       otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await transporter.sendMail({
//       from: `"TaskOra" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is ${otp}.`,
//     });

//     res.json({ success: true, message: "OTP sent to email" });
//   } catch (err) {
//     console.error("❌ SEND OTP ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });

// // ================= VERIFY OTP =================
// app.post("/verify-otp", async (req, res) => {
//   try {
//     const { email, otp, name, password } = req.body || {};

//     if (!email || !otp || !name || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     // DEBUG LOGS (CRITICAL)
//     console.log("🗄️ DB OTP:", otpRecord.otp);
//     console.log("👤 USER OTP:", otp);
//     console.log("🕒 EXPIRES AT:", otpRecord.expiresAt);

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     // FORCE STRING COMPARISON
//     if (String(otpRecord.otp) !== String(otp)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     const newUser = new UserModel({
//       username: name,
//       email,
//     });

//     await UserModel.register(newUser, password);

//     await Otp.deleteOne({ email });

//     res.status(201).json({
//       success: true,
//       message: "OTP verified & account created",
//     });
//   } catch (err) {
//     console.error("❌ VERIFY OTP ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });


// // ================= RESEND OTP =================
// app.post("/resend-otp", async (req, res) => {
//   try {
//     const email = req.body?.email;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     const lastOtp = await Otp.findOne({ email });

//     // ⏱️ 60 sec cooldown
//     if (lastOtp) {
//       const diff = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
//       if (diff < 60) {
//         return res.status(429).json({
//           success: false,
//           message: `Please wait ${Math.ceil(60 - diff)} seconds`,
//         });
//       }
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.deleteMany({ email });

//     await Otp.create({
//       email,
//       otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//     });

//     await transporter.sendMail({
//       from: `"TaskOra" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your NEW OTP Code",
//       text: `Your new OTP is ${otp}. Valid for 5 minutes.`,
//     });

//     res.json({
//       success: true,
//       message: "OTP resent successfully",
//     });
//   } catch (err) {
//     console.error("❌ Resend OTP error:", err);
//     res.status(500).json({ success: false });
//   }
// });



// // ================= BASIC TEST =================
// app.get("/app", (req, res) => {
//   res.send("working");
// });

// // ================= AUTH =================
// app.post(
//   "/signUp",
//   WrapAsync(async (req, res, next) => {
//     const newUser = new UserModel({
//       username: req.body.name,
//       email: req.body.email,
//     });

//     const user = await UserModel.register(newUser, req.body.password);
//     req.login(user, (err) => {
//       if (err) return next(err);
//       res.send("done");
//     });
//   })
// );

// app.post(
//   "/login",
//   passport.authenticate("local"),
//   WrapAsync(async (req, res) => {
//     res.json({
//       msg: "Login successful",
//       user: { username: req.user.username },
//     });
//   })
// );

// // ================= ROUTES =================
// app.use("/api", locationRoutes);

// // ================= START SERVER =================
// app.listen(PORT, () => {
//   console.log("🚀 App started");
//   mongoose.connect(url);
//   console.log("✅ DB connected");
// });




require("dotenv").config();

// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const axios = require("axios");
const nodemailer = require("nodemailer");

// ================= MODELS =================
const { Gig } = require("./models/Gigmodel");
const { Service } = require("./models/Servicemodel");
const { UserModel } = require("./models/UserModel");
const { Application } = require("./models/ApplicationModel");
// const { ServiceApplication } = require("./models/ServiceApplicationModel");
 const ServiceApplication = require("./models/ServiceApplicationModel");


const Otp = require("./models/OtpModel");

// ================= UTILS =================
const WrapAsync = require("./utils/WrapAsync");
const { isLoggedIn } = require("./middlewares/middleware");
const { upload } = require("./utils/Cloudinary");

// ================= ROUTES =================
const locationRoutes = require("./routes/locationRoutes");

const app = express();

// ================= ENV =================
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;
const secret = process.env.SECRET;
const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.set("trust proxy", 1);

// ================= SESSION =================
const store = MongoStore.create({
  mongoUrl: url,
  crypto: { secret },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ================= SEND OTP =================
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("📩 SENDING OTP:", otp, "TO:", email);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: `"TaskOra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("❌ SEND OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// ================= VERIFY OTP =================
// app.post("/verify-otp", async (req, res) => {
//   try {
//     const { name, email, password, otp, state, district } = req.body || {};

//     if (!name || !email || !password || !otp || !state || !district) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({ success: false, message: "OTP not found" });
//     }

//     console.log("🗄️ DB OTP:", otpRecord.otp);
//     console.log("👤 USER OTP:", otp);
//     console.log("🕒 EXPIRES AT:", otpRecord.expiresAt);

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(400).json({ success: false, message: "OTP expired" });
//     }

//     if (String(otpRecord.otp) !== String(otp)) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     const newUser = new UserModel({
//       username: name,
//       email,
//       state,
//       district,
//     });

//     await UserModel.register(newUser, password);
//     await Otp.deleteOne({ email });

//     res.json({
//       success: true,
//       message: "OTP verified & account created",
//     });
//   } catch (err) {
//     console.error("❌ VERIFY OTP ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });


app.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, password, otp, state, district } = req.body || {};

    if (!name || !email || !password || !otp || !state || !district) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (String(otpRecord.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ CLEAN USERNAME (NO RANDOM NUMBER)
    const username = name.trim().toLowerCase();

    // ✅ CHECK IF USERNAME EXISTS
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const newUser = new UserModel({
      username,
      email,
      state,
      district,
    });

    await UserModel.register(newUser, password);
    await Otp.deleteOne({ email });

    res.json({
      success: true,
      message: "OTP verified & account created",
      username,
    });
  } catch (err) {
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// ================= LOGIN =================
// app.post(
//   "/login",
//   passport.authenticate("local"),
//   WrapAsync(async (req, res) => {
//     res.json({
//       success: true,
//       user: req.user,
//     });
//   })
// );


// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         msg: "Invalid username or password",
//       });
//     }

//     // 🔐 CREATE SESSION
//     req.login(user, (err) => {
//       if (err) return next(err);

//       return res.json({
//         success: true,
//         user: {
//           _id: user._id,
//           username: user.username,
//           email: user.email,
//           state: user.state,
//           district: user.district,
//         },
//       });
//     });
//   })(req, res, next);
// });

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ msg: "Invalid username or password" });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        user: {
          username: user.username,
          email: user.email,
          state: user.state,
          district: user.district,
        },
      });
    });
  })(req, res, next);
});










// ================= CURRENT USER =================
// app.get("/current-user", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ success: false });
//   }
//   res.json({ success: true, user: req.user });
// });


app.get("/current-user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false });
  }

  res.json({
    success: true,
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      state: req.user.state,
      district: req.user.district,
    },
  });
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// ================= ADD GIG =================
// app.post("/addGig", isLoggedIn, async (req, res) => {
//   try {
//     const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, req.body);
//     if (aiRes.data.status !== "ok") {
//       return res.status(400).json({ error: aiRes.data.message });
//     }

//     const gig = new Gig({
//       ...req.body,
//       location: req.user.district,
//       district: req.user.district,
//       postedBy: req.user._id,
//     });

//     await gig.save();
//     res.status(201).json(gig);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create gig" });
//   }
// });


// app.post("/addGig", isLoggedIn, async (req, res) => {
//   try {
//     // ✅ TEMP: skip FastAPI
//     const aiRes = { data: { status: "ok" } };

//     if (aiRes.data.status === "ok") {
//       const newGig = new Gig({
//         ...req.body,
//         postedBy: req.user._id,
//       });

//       await newGig.save();
//       return res.status(201).json({
//         message: "Gig created successfully",
//         gig: newGig,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create gig" });
//   }
// });






// // ================= ADD GIG =================
// app.post("/addGig", isLoggedIn, async (req, res) => {
//   try {
//     /**
//      * 1️⃣ Send REQUIRED fields to FastAPI
//      *    (AI will ONLY check title & description internally)
//      */
//     const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, {
//       title: req.body.title,
//       description: req.body.description,

//       // 🔑 REQUIRED by FastAPI schema
//       location: req.body.location || "na",
//       category: req.body.category || "na",
//       date: req.body.date,          // MUST be YYYY-MM-DD
//       contact: req.body.contact,
//     });

//     /**
//      * 2️⃣ If AI blocks harmful content
//      */
//     if (aiRes.data.status !== "ok") {
//       return res.status(400).json({
//         error: "Harmful or unsafe content detected",
//         reason: aiRes.data.message,
//       });
//     }

//     /**
//      * 3️⃣ Create gig only if AI allows
//      */
//     const newGig = new Gig({
//       ...req.body,

//       // 🔥 keep your existing logic
//       location: req.user.district,
//       district: req.user.district,
//       postedBy: req.user._id,
//     });

//     await newGig.save();

//     res.status(201).json({
//       message: "Gig created successfully",
//       gig: newGig,
//     });

//   } catch (err) {
//     console.error("ADD GIG ERROR:", err.response?.data || err.message);

//     res.status(400).json({
//       error:
//         err.response?.data?.message ||
//         "Failed to create gig",
//     });
//   }
// });



// ================= ADD GIG (BASELINE + AI) =================
app.post("/addGig", isLoggedIn, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      state,
      district,
      location,
      date,
      contact,
    } = req.body;

    /**
     * 0️⃣ Hard backend validation (baseline safety)
     */
    if (
      !title ||
      !description ||
      !category ||
      !state ||
      !district ||
      !date ||
      !contact
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /**
     * 1️⃣ AI CHECK (ONLY checks title & description internally)
     *    ⚠️ We still send all required fields to FastAPI schema
     */
    await axios.post(`${process.env.FASTAPI_URL}/analyze`, {
      title,
      description,

      // required by FastAPI schema (NOT ML-checked)
      location: location || "na",
      category,
      date,       // must be YYYY-MM-DD
      contact,
    });

    /**
     * 2️⃣ SAVE GIG (BASELINE LOGIC — DO NOT CHANGE)
     */
    const newGig = new Gig({
      title,
      description,
      category,
      state,
      district,      // ✅ FROM FORM
      location,      // ✅ FROM FORM
      date,
      contact,
      postedBy: req.user._id, // ✅ AUTH
    });

    await newGig.save();

    return res.status(201).json({
      message: "Gig created successfully",
      gig: newGig,
    });

  } catch (err) {
    console.error("ADD GIG ERROR:", err.response?.data || err.message);

    return res.status(400).json({
      error:
        err.response?.data?.message ||
        "Gig rejected by AI or invalid data",
    });
  }
});



// ////// adservices
// app.post("/addService", isLoggedIn, async (req, res) => {
//   try {
//     const newService = new Service({
//       ...req.body,          // title, description, salary, state, district, location, date, contact
//       postedBy: req.user._id,
//     });

//     await newService.save();

//     return res.status(201).json({
//       message: "Service created successfully",
//       service: newService,
//     });
//   } catch (err) {
//     console.error("ADD SERVICE ERROR:", err);
//     res.status(500).json({ error: "Failed to create service" });
//   }
// });


// ================= ADD SERVICE (BASELINE + AI) =================
app.post("/addService", isLoggedIn, async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      state,
      district,
      location,
      date,
      contact,
    } = req.body;

    /**
     * 0️⃣ Hard backend validation (baseline safety)
     */
    if (
      !title ||
      !description ||
      !salary ||
      !state ||
      !district ||
      !date ||
      !contact
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    /**
     * 1️⃣ AI CHECK (ONLY checks title & description internally)
     *    ⚠️ We still send all required fields to FastAPI schema
     */
    await axios.post(`${process.env.FASTAPI_URL}/analyze_service`, {
      title,
      description,

      // required by FastAPI schema (NOT ML-checked)
      salary,
      location: location || "na",
      date,          // YYYY-MM-DD
      contact,
    });

    /**
     * 2️⃣ SAVE SERVICE (BASELINE LOGIC — DO NOT CHANGE)
     */
    const newService = new Service({
      title,
      description,
      salary,
      state,
      district,      // ✅ FROM FORM
      location,      // ✅ FROM FORM
      date,
      contact,
      postedBy: req.user._id, // ✅ AUTH
    });

    await newService.save();

    return res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });

  } catch (err) {
    console.error("ADD SERVICE ERROR:", err.response?.data || err.message);

    return res.status(400).json({
      error:
        err.response?.data?.message ||
        "Service rejected by AI or invalid data",
    });
  }
});



///////
console.log("🔥 REGISTERING GIG ROUTES");

// ================= GET GIG (EDIT LOAD) =================
app.get("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // 🔒 owner-only
    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json(gig);
  } catch (err) {
    console.error("❌ GET GIG ERROR:", err);
    res.status(500).json({ error: "Failed to fetch gig" });
  }
});

// ================= PUT GIG (EDIT + AI) =================
app.put("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    // 🔥 SEND FULL GigData SHAPE (MANDATORY)
    const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || "unknown",
      category: req.body.category || "Other",
      date: req.body.date,
      contact: req.body.contact,
    });

    if (aiRes.data.status !== "ok") {
      return res.status(400).json({
        error: aiRes.data.message,
      });
    }

    const updatedGig = await Gig.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedGig) {
      return res.status(404).json({
        error: "Gig not found or not authorized",
      });
    }

    res.json({
      message: "Gig updated successfully",
      gig: updatedGig,
    });

  } catch (err) {
    console.error("❌ UPDATE GIG ERROR:", err.response?.data || err.message);

    if (err.response?.data?.message) {
      return res.status(400).json({
        error: err.response.data.message,
      });
    }

    res.status(500).json({ error: "Failed to update gig" });
  }
});




///////
console.log("🔥 REGISTERING SERVICE ROUTES");

// ================= GET SERVICE (EDIT LOAD) =================
app.get("/service/:id", isLoggedIn, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // 🔒 owner-only
    if (service.postedBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    console.error("❌ GET SERVICE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// ================= PUT SERVICE (EDIT + AI) =================
app.put("/service/:id", isLoggedIn, async (req, res) => {
  try {
    // 🔥 SEND FULL ServiceData SHAPE (MANDATORY)
    const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location || "unknown",
      category: req.body.category || "Other",
      date: req.body.date,
      contact: req.body.contact,
    });

    if (aiRes.data.status !== "ok") {
      return res.status(400).json({
        error: aiRes.data.message,
      });
    }

    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        error: "Service not found or not authorized",
      });
    }

    res.json({
      message: "Service updated successfully",
      service: updatedService,
    });

  } catch (err) {
    console.error(
      "❌ UPDATE SERVICE ERROR:",
      err.response?.data || err.message
    );

    if (err.response?.data?.message) {
      return res.status(400).json({
        error: err.response.data.message,
      });
    }

    res.status(500).json({ error: "Failed to update service" });
  }
});



///////////////////////


app.post(
  "/applyService/:serviceId",
  isLoggedIn,
  upload.array("pictures", 5),
  async (req, res) => {
    try {
      const application = new ServiceApplication({
        service: req.params.serviceId,
        applicant: req.user._id,

        name: req.body.name,
        message: req.body.message,
        contact: req.body.contact,
        charges: req.body.charges,

        pictures: (req.files || []).map((f) => f.path),
      });

      await application.save();

      res.json({ success: true });
    } catch (err) {
      console.error("❌ APPLY SERVICE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);



////////////////   my service application histroy

app.get("/my-service-applications", isLoggedIn, async (req, res) => {
  try {
    const apps = await ServiceApplication.find({
      applicant: req.user._id,
    })
      .populate("service") // get service details
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("❌ ERROR FETCHING SERVICE APPLICATIONS:", err);
    res.status(500).json({
      error: "Failed to fetch service applications",
    });
  }
});



// ================= SEARCH (OPTION B) =================
app.get("/getGigs/:city", async (req, res) => {
  const city = req.params.city;
  const gigs = await Gig.find({
    $or: [
      { location: new RegExp(city, "i") },
      { district: new RegExp(city, "i") },
    ],
  }).populate("postedBy", "username email");
  res.json(gigs);
});

app.get("/getService/:city", async (req, res) => {
  const city = req.params.city;
  const services = await Service.find({
    $or: [
      { location: new RegExp(city, "i") },
      { district: new RegExp(city, "i") },
    ],
  });
  res.json(services);
});

// ================= NEAR ME =================
app.get("/gigs-near-me", isLoggedIn, async (req, res) => {
  const gigs = await Gig.find({ district: req.user.district }).populate(
    "postedBy",
    "username email"
  );
  res.json(gigs);
});

app.get("/services-near-me", isLoggedIn, async (req, res) => {
  const services = await Service.find({ district: req.user.district });
  res.json(services);
});

// ================= APPLICATIONS =================   for gig
app.post(
  "/applyGig/:gigId",
  isLoggedIn,
  upload.array("pictures", 5),
  async (req, res) => {
    const application = new Application({
      gig: req.params.gigId,
      applicant: req.user._id,
      ...req.body,
      pictures: req.files.map((f) => f.path),
    });

    await application.save();
    res.json({ success: true });
  }
);


// // ================= APPLY SERVICE (OWNER BLOCKED + SAFE FILES) =================
// app.post(
//   "/applyService/:serviceId",
//   isLoggedIn,
//   upload.array("pictures", 5),
//   async (req, res) => {
//     try {
//       // 1️⃣ Fetch service
//       const service = await Service.findById(req.params.serviceId);

//       if (!service) {
//         return res.status(404).json({
//           error: "Service not found ❌",
//         });
//       }

//       // 2️⃣ Prevent owner from applying
//       if (service.postedBy.toString() === req.user._id.toString()) {
//         return res.status(400).json({
//           error: "You cannot apply to your own service ❌",
//         });
//       }

//       // 3️⃣ SAFE pictures handling (🔥 THIS FIXES 500)
//       const pictures =
//         req.files && req.files.length > 0
//           ? req.files.map((f) => f.path)
//           : [];

//       // 4️⃣ Save application
//       const application = new ServiceApplication({
//         service: req.params.serviceId,
//         applicant: req.user._id,
//         ...req.body,
//         pictures,
//       });

//       await application.save();

//       res.json({ success: true });
//     } catch (err) {
//       console.error("❌ APPLY SERVICE ERROR:", err);
//       res.status(500).json({
//         error: "Failed to apply for service",
//       });
//     }
//   }
// );

app.post(
  "/applyService/:serviceId",
  isLoggedIn,
  upload.array("pictures", 5),
  async (req, res) => {
    try {
      const application = new ServiceApplication({
        service: req.params.serviceId,
        applicant: req.user._id,
        name: req.body.name,
        message: req.body.message,
        contact: req.body.contact,
        charges: req.body.charges,
        pictures: (req.files || []).map((f) => f.path),
      });

      await application.save();
      res.json({ success: true });
    } catch (err) {
      console.error("❌ APPLY SERVICE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);











app.get("/my-applications", isLoggedIn, async (req, res) => {
  const apps = await Application.find({
    applicant: req.user._id,
  }).populate("gig");
  res.json(apps);
});




////
// ================= GIG COUNT BY DISTRICT =================
// app.get("/count/gigs/:district", async (req, res) => {
//   try {
//     const { district } = req.params;
//     const count = await Gig.countDocuments({
//       district: { $regex: new RegExp(`^${district}$`, "i") },
//     });
//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ count: 0 });
//   }
// });

app.get("/count/gigs/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const count = await Gig.countDocuments({
      $or: [
        { location: { $regex: new RegExp(city, "i") } },
        { district: { $regex: new RegExp(city, "i") } },
      ],
    });

    res.json({ count });
  } catch (err) {
    console.error("Gig count error:", err);
    res.status(500).json({ count: 0 });
  }
});


// ================= SERVICE COUNT BY DISTRICT =================
app.get("/count/services/:district", async (req, res) => {
  try {
    const { district } = req.params;
    const count = await Service.countDocuments({
      district: { $regex: new RegExp(`^${district}$`, "i") },
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});
//

app.get("/debug-users", async (req, res) => {
  const users = await UserModel.find({});
  res.json(users.map(u => ({
    username: u.username,
    email: u.email,
  })));
});





// ================= MY GIGS =================
app.get("/my-gigs", isLoggedIn, async (req, res) => {
  try {
    const gigs = await Gig.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // ✅ faster, safer for read-only

    res.status(200).json(gigs);
  } catch (err) {
    console.error("❌ Error fetching user gigs:", err);
    res.status(500).json({
      error: "Failed to fetch your gigs",
    });
  }
});

// // ================= MY SERVICES =================
// app.get("/my-services", isLoggedIn, async (req, res) => {
//   try {
//     const services = await Service.find({
//       postedBy: req.user._id, // 🔒 only services created by logged-in user
//     })
//       .sort({ createdAt: -1 }) // latest first
//       .lean(); // ✅ faster, safe for read-only

//     res.status(200).json(services);
//   } catch (err) {
//     console.error("❌ Error fetching user services:", err);
//     res.status(500).json({
//       error: "Failed to fetch your services",
//     });
//   }
// });

// ================= MY SERVICES =================
app.get("/my-services", isLoggedIn, async (req, res) => {
  try {
    const services = await Service.find({
      postedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(services);
  } catch (err) {
    console.error("❌ Error fetching user services:", err);
    res.status(500).json({
      error: "Failed to fetch your services",
    });
  }
});




// ================= MY APPLICATIONS =================
app.get("/my-applications", isLoggedIn, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "gig",
        select: "title location date category district state",
      })
      .sort({ createdAt: -1 })
      .lean(); // ✅ faster, read-only

    res.status(200).json(applications);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
});


// ================= DELETE GIG (OWNER ONLY) =================
app.delete("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const deletedGig = await Gig.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id, // 🔒 owner-only
    });

    if (!deletedGig) {
      return res.status(404).json({
        error: "Gig not found or not authorized ❌",
      });
    }

    res.status(200).json({
      message: "✅ Gig deleted successfully",
    });

  } catch (err) {
    console.error("❌ Error deleting gig:", err);
    res.status(500).json({
      error: "Server error while deleting gig",
    });
  }
});

// ================= DELETE SERVICE (OWNER ONLY) =================
app.delete("/service/:id", isLoggedIn, async (req, res) => {
  try {
    console.log("🔥 DELETE SERVICE HIT:", req.params.id);
    console.log("👤 USER:", req.user._id);

    const service = await Service.findById(req.params.id);

    // ❌ Not found
    if (!service) {
      return res.status(404).json({
        error: "Service not found ❌",
      });
    }

    // 🔒 Owner-only check
    if (service.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Not authorized to delete this service ❌",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "✅ Service deleted successfully",
    });

  } catch (err) {
    console.error("❌ Error deleting service:", err);
    res.status(500).json({
      error: "Server error while deleting service",
    });
  }
});


// ================= VIEW GIG APPLICANTS (OWNER ONLY) =================
app.get("/gig/:id/applicants", isLoggedIn, async (req, res) => {
  try {
    // 1️⃣ Verify gig exists
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // 2️⃣ Owner-only access
    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Not authorized to view applicants",
      });
    }

    // 3️⃣ Fetch applications for this gig
    const applications = await Application.find({ gig: gig._id })
      .populate("applicant", "username email") // safe public info
      .sort({ createdAt: -1 });

    // 4️⃣ Response
    res.status(200).json({
      count: applications.length,
      applications,
    });

  } catch (err) {
    console.error("❌ Error fetching applicants:", err);
    res.status(500).json({
      error: "Failed to fetch applicants",
    });
  }
});



// ================= VIEW SERVICE APPLICANTS (OWNER ONLY) =================
app.get("/service/:id/applicants", isLoggedIn, async (req, res) => {
  try {
    // 1️⃣ Verify service exists
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    // 2️⃣ Owner-only access
    if (service.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Not authorized to view applicants",
      });
    }

    // 3️⃣ Fetch applications for this service
    const applications = await ServiceApplication.find({
      service: service._id,
    })
      .populate("applicant", "username email")
      .sort({ createdAt: -1 });

    // 4️⃣ Response
    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error("❌ Error fetching service applicants:", err);
    res.status(500).json({
      error: "Failed to fetch applicants",
    });
  }
});


// ================= GET CURRENT USER =================
app.get("/me", isLoggedIn, (req, res) => {
  const user = req.user;

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    categories: user.categories || "",
    avatar: user.avatar || "",
  });
});

/////
app.put(
  "/update-profile",
  isLoggedIn,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const updates = {
        name: req.body.name,
        phone: req.body.phone,
        location: req.body.location,
        categories: req.body.categories,
      };

      if (req.file) {
        updates.avatar = req.file.path; // 🔴 THIS LINE IS KEY
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ success: false });
      }

      req.login(updatedUser, (err) => {
        if (err) {
          return res.status(500).json({ success: false });
        }

        res.json({
          success: true,
          user: updatedUser,
        });
      });
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);


// ================= EXTRA ROUTES =================
app.use("/api", locationRoutes);

// ================= START =================
app.listen(PORT, async () => {
  await mongoose.connect(url);
  console.log("🚀 Server running & DB connected");
});




