


// import React, { useEffect, useState } from "react";
// import API from "../api"; // adjust path if needed
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import Confetti from "react-confetti";
// import "./otp.css";

// const OtpVerify = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const signupData = location.state;

//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(60);
//   const [loading, setLoading] = useState(false);
//   const [celebrate, setCelebrate] = useState(false);

//   useEffect(() => {
//     if (!signupData) {
//       toast.error("Signup session expired. Please signup again.");
//       navigate("/signup");
//     }
//   }, [signupData, navigate]);

//   useEffect(() => {
//     if (timer === 0) return;
//     const interval = setInterval(() => {
//       setTimer((t) => t - 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     const { name, email, password, state, district } = signupData;

//     try {
//       setLoading(true);

//       // await axios.post("http://localhost:3002/verify-otp", {
//       //   name,
//       //   email,
//       //   password,
//       //   otp: otp.toString(),
//       //   state,
//       //   district,
//       // });
//       await API.post("/auth/verify-otp", {
//         name,
//         email,
//         password,
//         otp: otp.toString(),
//         state,
//         district,
//       });

//       // 🎉 Trigger celebration
//       setCelebrate(true);

//       // Stop animation after 4 seconds
//       setTimeout(() => {
//         setCelebrate(false);
//         navigate("/login");
//       }, 4000);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-container">
//       {celebrate && (
//         <>
//           <Confetti numberOfPieces={300} />
//           <div className="celebration-overlay">
//             <div className="celebration-message">
//               🚀 You're officially a Taskorian!
//               <br />
//               <span>100 bonus tokens unlocked! 💰</span>
//             </div>

//             {/* Floating Coins */}
//             <div className="coin coin1">🪙</div>
//             <div className="coin coin2">🪙</div>
//             <div className="coin coin3">🪙</div>
//             <div className="coin coin4">🪙</div>
//             <div className="coin coin5">🪙</div>
//             <div className="coin coin1">🪙</div>
//             <div className="coin coin2">🪙</div>
//             <div className="coin coin3">🪙</div>
//             <div className="coin coin4">🪙</div>
//             <div className="coin coin5">🪙</div>
//             <div className="coin coin1">🪙</div>
//             <div className="coin coin2">🪙</div>
//             <div className="coin coin3">🪙</div>
//             <div className="coin coin4">🪙</div>
//             <div className="coin coin5">🪙</div>
//             <div className="coin coin1">🪙</div>
//             <div className="coin coin2">🪙</div>
//             <div className="coin coin3">🪙</div>
//             <div className="coin coin4">🪙</div>
//             <div className="coin coin5">🪙</div>
//           </div>
//         </>
//       )}

//       <div className="signup-form">
//         <h2>Verify OTP</h2>

//         <p>
//           OTP sent to <b>{signupData?.email}</b>
//         </p>

//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <button onClick={verifyOtp} disabled={loading}>
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>

//         {timer > 0 ? (
//           <p>Resend OTP in {timer}s</p>
//         ) : (
//           <button type="button" onClick={resendOtp}>
//             Resend OTP
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OtpVerify;



import React, { useEffect, useState } from "react";
import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import "./otp.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupData = location.state;

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!signupData) {
      toast.error("Signup session expired. Please signup again.");
      navigate("/signup");
    }
  }, [signupData, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    const { name, email, password, state, district } = signupData;

    try {
      setLoading(true);

      await API.post("/auth/verify-otp", {
        name,
        email,
        password,
        otp: otp.toString(),
        state,
        district,
      });

      // 🎉 Trigger celebration
      setCelebrate(true);

      setTimeout(() => {
        setCelebrate(false);
        navigate("/login");
      }, 4000);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const resendOtp = async () => {
    if (!signupData) return;

    const { email } = signupData;

    try {
      await API.post("/auth/send-otp", { email });

      toast.success("New OTP sent 📩");

      setTimer(60); // restart timer
    } catch (err) {
      toast.error("Failed to resend OTP ❌");
    }
  };

  return (
    <div className="signup-container">

      {celebrate && (
        <>
          <Confetti numberOfPieces={300} />
          <div className="celebration-overlay">
            <div className="celebration-message">
              🚀 You're officially a Taskorian!
              <br />
              <span>100 bonus tokens unlocked! 💰</span>
            </div>

            {/* Floating Coins (unchanged) */}
            <div className="coin coin1">🪙</div>
            <div className="coin coin2">🪙</div>
            <div className="coin coin3">🪙</div>
            <div className="coin coin4">🪙</div>
            <div className="coin coin5">🪙</div>
            <div className="coin coin1">🪙</div>
            <div className="coin coin2">🪙</div>
            <div className="coin coin3">🪙</div>
            <div className="coin coin4">🪙</div>
            <div className="coin coin5">🪙</div>
            <div className="coin coin1">🪙</div>
            <div className="coin coin2">🪙</div>
            <div className="coin coin3">🪙</div>
            <div className="coin coin4">🪙</div>
            <div className="coin coin5">🪙</div>
          </div>
        </>
      )}

      <div className="signup-form">
        <h2>Verify OTP</h2>

        <p>
          OTP sent to <b>{signupData?.email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {timer > 0 ? (
          <p>Resend OTP in {timer}s</p>
        ) : (
          <button type="button" onClick={resendOtp}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerify;