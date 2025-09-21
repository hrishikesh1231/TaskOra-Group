require('dotenv').config(); //env 

// location 


const locationRoutes = require("./routes/locationRoutes");

//
const express = require('express');
const mongoose = require('mongoose');
const { Gig } = require('./models/Gigmodel');
const { gigsData } = require('./Data/GigsData');

const app = express();

const cors = require('cors');
const { Service } = require('./models/Servicemodel');
const { servicesData } = require('./Data/ServiceData');

const session = require('express-session');
const MongoStore = require('connect-mongo'); //session store on deployment
const passport = require('passport');//3 types 2 here 1 in modeluser
const LocalStrategy = require('passport-local');

const bodyParser = require('body-parser');
const { UserModel } = require('./models/UserModel');
const WrapAsync = require('./utils/WrapAsync');
const { isLoggedIn } = require('./middlewares/middleware');
const axios = require("axios");

const multer = require("multer");
const path = require("path");
const { upload } = require('./utils/Cloudinary');
const { Application } = require('./models/ApplicationModel');

// services
const { ServiceApplication } = require("./models/ServiceApplicationModel");


const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;
const secret = process.env.SECRET;

const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000"; // Python FastAPI service


app.use(express.json());

//
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: 'http://localhost:3000', // your React dev URL
    // methods: ['GET', 'POST'],
    credentials: true
}));

app.set("trust proxy", 1);

//mogno store
const store =MongoStore.create({
    mongoUrl:url,
    crypto: {
        secret: secret,
    },
    touchAfter:24*3600,
})
//if error
store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);

})
const sessionOption = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   // ✅ must be false on localhost
    sameSite: "lax", // ✅ fixes cookie being blocked
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};


//session
app.use(session(sessionOption));

//passport //read documentation //for creatig user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()))
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


app.get('/app',(req,res)=>{
    res.send("working sdgv");
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure uploads/ exists in backend root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const upload = multer({ storage });



app.post('/dummy1', WrapAsync(async (req, res) => {
  try {
    await Gig.deleteMany({}); // clear old data
    const inserted = await Service.insertMany(servicesData);
    res.send("Seed success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error seeding data");
  }
}));

//new Gig post
// New Gig post with AI moderation
// GIGS
// New Gig post with AI moderation
app.post('/addGig', isLoggedIn, async (req, res) => {
  try {
    const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, req.body);

    if (aiRes.data.status === "ok") {
      const newGig = new Gig({
        ...req.body,
        postedBy: req.user._id // ✅ store user’s ObjectId
      });

      await newGig.save();
      return res.status(201).json({ message: "✅ Gig created successfully", gig: newGig });
    }

    return res.status(400).json({ error: aiRes.data.message });

  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status || 400).json({
        error: err.response.data.message || "Rejected by AI validation"
      });
    }
    console.error("Error in /addGig:", err);
    res.status(500).json({ error: "Server error while creating gig" });
  }
});

// SERVICES
app.post("/addService", isLoggedIn, async (req, res) => {
  try {
    let { title, description, salary, location, postedBy, contact, date } = req.body;

    // 1️⃣ Ensure correct date format (YYYY-MM-DD)
    let isoDate = null;
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        isoDate = parsed.toISOString().split("T")[0]; // force ISO date
      }
    }

    // 2️⃣ Clean salary (remove ₹, numbers, and special chars for AI moderation)
    const cleanSalary = salary ? salary.toString().replace(/[^a-zA-Z\s]/g, "").trim() : "";

    // 3️⃣ Clean contact (only keep digits, allow +91 format)
    let cleanContact = contact ? contact.toString().trim() : "";
    if (cleanContact.startsWith("+")) {
      cleanContact = "+" + cleanContact.replace(/\D/g, "");
    } else {
      cleanContact = cleanContact.replace(/\D/g, "");
    }

    // 4️⃣ Debug log (check payload being sent to FastAPI)
    console.log("📤 Sending to FastAPI /analyze_service:", {
      title,
      description,
      salary: cleanSalary,
      location,
      postedBy,
      contact: cleanContact,
      date: isoDate,
    });

    // 5️⃣ Call FastAPI moderation
    const aiResponse = await axios.post(`${FASTAPI_URL}/analyze_service`, {
      title,
      description,
      salary: cleanSalary,
      location,
      postedBy,
      contact: cleanContact,
      date: isoDate,
    });

    // 6️⃣ If safe → save in MongoDB (store original values for salary/date)
    if (aiResponse.data.status === "ok") {
      const newService = new Service({
        title,
        description,
        salary, // store raw salary (e.g. ₹12000/month)
        location,
        postedBy,
        contact, // store raw contact
        date: new Date(date), // store raw date
      });

      await newService.save();
      return res.status(201).json({ message: "Service created successfully ✅", service: newService });
    }

    return res.status(400).json({ error: aiResponse.data.message });

  } catch (err) {
    if (err.response && err.response.data) {
      return res.status(err.response.status || 400).json({
        error: err.response.data.message || "Rejected by AI validation",
      });
    }

    console.error("❌ Error in /addService:", err.message);
    res.status(500).json({ error: "Failed to create service" });
  }
});




// app.get('/getGigs',WrapAsync(async(req,res)=>{
//     try{
//         let allGigs = await Gig.find({});
//         res.json(allGigs);
//     }catch(err){
//         console.log(err);
//     }
// }))
// backend: filter gigs by city
app.get('/getGigs/:city', WrapAsync(async (req, res) => {
  try {
    const city = req.params.city;

    // ✅ Populate postedBy with username + email
    let gigs = await Gig.find({ location: { $regex: new RegExp(city, "i") } })
      .populate("postedBy", "username email");

    res.json(gigs);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}));


app.get('/getService/:city', WrapAsync(async(req,res)=>{
    try{
        const { city } = req.params;
        let allService = await Service.find({ location: new RegExp(`^${city}$`, "i") }); 
        res.json(allService);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));




//user authentication
app.post("/signUp",WrapAsync(async(req,res,next)=>{
    // let hashedPassword = await bcrypt.hash(req.body.password,10);
    // console.log(hashedPassword);
        let newUser = UserModel({
        username:req.body.name,
        email:req.body.email,
        // password:hashedPassword,
        });
        let user = await UserModel.register(newUser,req.body.password);
        req.login(user, (err) => {
        if(err) {
           return next(err);
        }else{
            res.send("done");
        }
        });
    // } catch (error) {
    //     throw new ExpressError(404,error.message); //no use //try catch stops crash
    // }
}));

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    // failureFlash: true,
  }),
  WrapAsync(async (req, res) => {
    res.json({
      msg: "Login successful",
      user: { username: req.user.username },
    });
  }
));


app.get("/current-user", (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            success: true,
            user: req.user, // Passport automatically attaches user to req
        });
    } else {
        return res.status(401).json({ success: false, message: "Not logged in" });
    }
});


// LOGOUT ROUTE
app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        // Destroy session after logout
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Session destroy failed" });
            }

            res.clearCookie("connect.sid"); // Important: Clears session cookie
            return res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    });
});

//post application form
app.post("/applyGig/:gigId", isLoggedIn, upload.array("pictures", 5), async (req, res) => {
  try {
    const { name, message, contact, charges } = req.body;

    const application = new Application({
      gig: req.params.gigId,
      applicant: req.user._id,
      name,
      message,
      contact,
      charges,
      // ✅ Cloudinary stores URLs in req.files
      pictures: req.files.map((file) => file.path), 
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully ✅" });
  } catch (err) {
    console.error("❌ Error in /applyGig:", err);
    res.status(500).json({ error: "Failed to apply", details: err.message });
  }
});


//get task appiled history
app.get("/my-applications", isLoggedIn, async (req, res) => {
  // console.log(req.user);
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("gig", "title location date category")  // show gig info
      .sort({ createdAt: -1 }); // latest first

    res.json(apps);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

app.use("/api", locationRoutes);

//

// services

app.post("/applyService/:serviceId", isLoggedIn, upload.array("pictures", 5), async (req, res) => {
  try {
    const { name, message, contact, charges } = req.body;

    const application = new ServiceApplication({
      service: req.params.serviceId,
      applicant: req.user._id,
      name,
      message,
      contact,
      charges,
      pictures: req.files.map((file) => file.path), // Cloudinary URLs
    });

    await application.save();
    res.status(201).json({ message: "✅ Service application submitted successfully" });
  } catch (err) {
    console.error("❌ Error in /applyService:", err);
    res.status(500).json({ error: "Failed to apply for service", details: err.message });
  }
});

app.get("/my-service-applications", isLoggedIn, async (req, res) => {
  try {
    const apps = await ServiceApplication.find({ applicant: req.user._id })
      .populate("service", "title description location date salary contact postedBy") // include more fields
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("❌ Error fetching service applications:", err);
    res.status(500).json({ error: "Failed to fetch service applications" });
  }
});





// popular categories

// ✅ Get gigs by category
app.get('/getGigsByCategory/:category', WrapAsync(async (req, res) => {
  try {
    const category = req.params.category;
    let gigs = await Gig.find({ category: { $regex: new RegExp(category, "i") } });
    res.json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}));


//my gigs-history
// backend/index.js
app.get("/my-gigs", isLoggedIn, async (req, res) => {
  try {
    const gigs = await Gig.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 }); // latest first

    res.json(gigs);
  } catch (err) {
    console.error("❌ Error fetching user gigs:", err);
    res.status(500).json({ error: "Failed to fetch your gigs" });
  }
});
// Edit Gig (with AI moderation)
app.put("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    // 🔎 Call FastAPI moderation first
    const aiRes = await axios.post(`${FASTAPI_URL}/analyze`, req.body);

    if (aiRes.data.status !== "ok") {
      return res.status(400).json({ error: aiRes.data.message });
    }

    // ✅ Update gig if safe
    const updatedGig = await Gig.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user._id }, // only allow owner to update
      req.body,
      { new: true }
    );

    if (!updatedGig) {
      return res.status(404).json({ error: "Gig not found or not authorized ❌" });
    }

    res.status(200).json({ message: "✅ Gig updated successfully", gig: updatedGig });
  } catch (err) {
    console.error("❌ Error updating gig:", err);
    if (err.response?.data) {
      return res.status(400).json({ error: err.response.data.message });
    }
    res.status(500).json({ error: "Server error while updating gig" });
  }
});


app.get("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const gig = await Gig.findOne({
      _id: req.params.id,
      postedBy: req.user._id, // ✅ only your own gigs
    });
    if (!gig) return res.status(404).json({ error: "Gig not found ❌" });
    res.json(gig);
  } catch (err) {
    console.error("❌ Error fetching gig:", err);
    res.status(500).json({ error: "Failed to fetch gig" });
  }
});

//delete functionality
// Delete Gig (only owner can delete)
app.delete("/gig/:id", isLoggedIn, async (req, res) => {
  try {
    const deletedGig = await Gig.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.user._id, // only allow the owner to delete
    });

    if (!deletedGig) {
      return res.status(404).json({ error: "Gig not found or not authorized ❌" });
    }

    res.status(200).json({ message: "✅ Gig deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting gig:", err);
    res.status(500).json({ error: "Server error while deleting gig" });
  }
});





app.listen(PORT,()=>{
    console.log("App started!")
    //mono connecct
    mongoose.connect(url);
    console.log("DB connected..")
}) 

