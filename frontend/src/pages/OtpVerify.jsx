// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const OtpVerify = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get data safely
//   const signupData = location.state;

//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(60);
//   const [loading, setLoading] = useState(false);

//   // Redirect if data missing
//   useEffect(() => {
//     if (!signupData) {
//       toast.error("Signup session expired. Please signup again.");
//       navigate("/signup");
//     }
//   }, [signupData, navigate]);

//   // Countdown
//   useEffect(() => {
//     if (timer === 0) return;
//     const interval = setInterval(() => {
//       setTimer((t) => t - 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     if (!signupData) {
//       return toast.error("Signup data missing.");
//     }

//     const { name, email, password, state, district } = signupData;

//     try {
//       setLoading(true);

//       console.log("Sending:", {
//         name,
//         email,
//         password,
//         otp,
//         state,
//         district,
//       });

//       await axios.post("http://localhost:3002/verify-otp", {
//         name,
//         email,
//         password,
//         otp: otp.toString(),
//         state,
//         district,
//       });

//       toast.success("Account created 🎉");
//       navigate("/login");

//     } catch (err) {
//       console.log("Error:", err.response?.data);
//       toast.error(
//         err.response?.data?.message || "OTP verification failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     if (!signupData?.email) return;

//     try {
//       await axios.post("http://localhost:3002/send-otp", {
//         email: signupData.email,
//       });
//       setTimer(60);
//       toast.success("OTP resent");
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           "Please wait before resending"
//       );
//     }
//   };

//   return (
//     <div className="signup-container">
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
//           <button onClick={resendOtp}>Resend OTP</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OtpVerify;



import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    const { name, email, password, state, district } = signupData;

    try {
      setLoading(true);

      await axios.post("http://localhost:3002/verify-otp", {
        name,
        email,
        password,
        otp: otp.toString(),
        state,
        district,
      });

      // 🎉 Trigger celebration
      setCelebrate(true);

      // Stop animation after 4 seconds
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

            {/* Floating Coins */}
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
          <button>Resend OTP</button>
        )}
      </div>
    </div>
  );
};

export default OtpVerify;