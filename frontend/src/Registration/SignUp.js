import React, { useState } from "react";
import "./SignUp.css";
import API from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const SignUp = () => {


const indiaLocations = {
  AndhraPradesh: [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Kadapa",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
  ],

  ArunachalPradesh: [
    "Tawang",
    "West Kameng",
    "East Kameng",
    "Papum Pare",
    "Lower Subansiri",
    "Upper Subansiri",
    "West Siang",
    "East Siang",
    "Upper Siang",
    "Lower Dibang Valley",
    "Dibang Valley",
    "Anjaw",
    "Changlang",
    "Tirap",
    "Longding",
  ],

  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara",
    "Tinsukia",
    "Udalguri",
  ],

  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],

  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],

  Goa: ["North Goa", "South Goa"],

  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],

  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],

  HimachalPradesh: [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],

  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahebganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],

  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikkaballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayanagara",
    "Yadgir",
  ],

  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],

  MadhyaPradesh: [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],

  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],

  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Mansa",
    "Moga",
    "Mohali",
    "Muktsar",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Tarn Taran",
  ],

  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],

  TamilNadu: [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],

  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal Rural",
    "Warangal Urban",
    "Yadadri Bhuvanagiri",
  ],

  UttarPradesh: [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shrawasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],

  WestBengal: [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
  ],
  AndamanAndNicobarIslands: [
    "Nicobar",
    "North and Middle Andaman",
    "South Andaman",
  ],

  Chandigarh: ["Chandigarh"],

  DadraAndNagarHaveliAndDamanAndDiu: ["Dadra and Nagar Haveli", "Daman", "Diu"],

  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],

  JammuAndKashmir: [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
  ],

  Ladakh: ["Kargil", "Leh"],

  Lakshadweep: ["Lakshadweep"],

  Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam"],
};



  const navigate = useNavigate();

  // 🔥 MOBILE STATES
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
const [emailOtpSent, setEmailOtpSent] = useState(false);
const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
    district: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    setFormData({
      ...formData,
      state: e.target.value,
      district: "",
    });
  };

const sendOTP = async () => {
  try {
    await API.post("http://localhost:3002/api/otp/send-otp", { mobile });

    setOtpSent(true);
    toast.success("OTP sent 🚀");
  } catch (err) {
    toast.error("Failed to send OTP");
  }
};

const verifyOTP = async () => {
  try {
    await API.post("http://localhost:3002/api/otp/verify-otp", { mobile, otp });

    setIsVerified(true);
    setOtp("");
    setOtpSent(false);

    toast.success("Mobile verified ✅");
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid OTP");
  }
};
const sendEmailOtp = async () => {
  try {
    await API.post("/auth/send-otp", {
      email: formData.email,
      name: formData.name,
    });

    setEmailOtpSent(true);
    toast.success("OTP sent to email 📩");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
  }
};
const verifyEmailOtp = async () => {
  try {
    await API.post("/auth/verify-email-otp", {
      email: formData.email.trim().toLowerCase(), // ✅ FIX
      otp: emailOtp.trim(), // ✅ FIX
    });

    setIsEmailVerified(true);
    setEmailOtp("");
    setEmailOtpSent(false);

    toast.success("Email verified ✅");
  } catch (err) {
    console.log("ERROR:", err.response?.data); // 🔍 DEBUG
    toast.error(err.response?.data?.message || "Invalid OTP");
  }
};
  // 🔥 FORM SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔒 Check mobile
  if (!isVerified) {
    return toast.error("Verify mobile first");
  }

  // 🔒 Check email
  if (!isEmailVerified) {
    return toast.error("Verify email first");
  }

  try {
    // 🔥 CALL REGISTER API
    const res = await API.post("/auth/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      state: formData.state,
      district: formData.district,
      mobile: mobile,
    });

    // ✅ SUCCESS
    toast.success(res.data.message || "Signup successful 🎉");

    // 🔁 RESET FORM (optional)
    setFormData({
      name: "",
      email: "",
      password: "",
      state: "",
      district: "",
    });

    setMobile("");
    setIsVerified(false);
    setIsEmailVerified(false);

    // 🚀 REDIRECT
    navigate("/login");

  } catch (err) {
    // ❌ ERROR HANDLING
    toast.error(
      err.response?.data?.message || "Signup failed ❌"
    );
  }
};

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Sign Up</h2>

        {/* USERNAME */}
        <input
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* 🔥 MOBILE INPUT + VERIFY */}
{/* 🔥 MOBILE INPUT + VERIFY */}
        <div className="mobile-wrapper">
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            disabled={isVerified}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 10) setMobile(val);
            }}
          />

          {mobile.length === 10 && !otpSent && !isVerified && (
            <button className="verify-btn" onClick={sendOTP} type="button">
              Send OTP
            </button>
          )}

          {isVerified && (
            <button className="verify-btn verified" disabled>
              Verified
            </button>
          )}
        </div>


        {/* 🔥 OTP INPUT */}
{/* 🔥 OTP INPUT */}
        {otpSent && !isVerified && (
          <div className="otp-box">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="verify-btn" onClick={verifyOTP} type="button">
              Verify
            </button>
          </div>
        )}

        {/* ✅ VERIFIED MESSAGE */}
        {isVerified && (
          <p style={{ color: "green", marginTop: "5px" }}>
            Mobile Verified ✅
          </p>
        )}

      <div className="email-wrapper">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          disabled={isEmailVerified}
          onChange={handleChange}
          required
        />

        {formData.email.includes("@gmail.com") &&
          !emailOtpSent &&
          !isEmailVerified && (
            <button
              type="button"
              className="verify-btn"
              onClick={sendEmailOtp}
            >
              Verify
            </button>
          )}

        {isEmailVerified && (
          <button className="verify-btn verified" disabled>
            Verified
          </button>
        )}
      </div>

      {emailOtpSent && !isEmailVerified && (
        <div className="otp-box">
          <input
            type="text"
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
          />

          <button
            type="button"
            className="verify-btn"
            onClick={verifyEmailOtp}
          >
            Verify
          </button>
        </div>
      )}

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* STATE */}
        <select
          name="state"
          value={formData.state}
          onChange={handleStateChange}
          required
        >
          <option value="">Select State</option>
          {Object.keys(indiaLocations).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* DISTRICT */}
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">Select District</option>
          {formData.state &&
            indiaLocations[formData.state].map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>

        <button type="submit">Register</button>

        <a href="/login">Already have an account?</a>
      </form>
    </div>
  );
};

export default SignUp;