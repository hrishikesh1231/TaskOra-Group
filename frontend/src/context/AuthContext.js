



// import {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useRef,
// } from "react";
// import axios from "axios";
// import { CityContext } from "./CityContext";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const { setCity } = useContext(CityContext);

//   const [user, setUserState] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔑 prevents auth race condition
//   const justLoggedInRef = useRef(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       // 🚫 Skip check right after login
//       if (justLoggedInRef.current) {
//         justLoggedInRef.current = false;
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await axios.get("/current-user");
//         const loggedUser = res.data.user;

//         setUserState(loggedUser);

//         if (loggedUser?.district) {
//           setCity(loggedUser.district);
//         }
//       } catch {
//         setUserState(null);
//         setCity(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [setCity]);

//   // ✅ THIS is what SignIn must use
//   const loginUser = (userData) => {
//     justLoggedInRef.current = true;
//     setUserState(userData);

//     if (userData?.district) {
//       setCity(userData.district);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.get("/logout");
//     } catch {}

//     setUserState(null);
//     setCity(null);
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser: loginUser, // 🔥 IMPORTANT
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };



import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { CityContext } from "./CityContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setCity } = useContext(CityContext);

  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 prevents auth race condition
  const justLoggedInRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      // 🚫 Skip check right after login
      if (justLoggedInRef.current) {
        justLoggedInRef.current = false;
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/current-user");
        const loggedUser = res.data.user;

        setUserState(loggedUser);

        if (loggedUser?.district) {
          setCity(loggedUser.district);
        }
      } catch {
        setUserState(null);
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setCity]);

  // ✅ THIS is what SignIn must use
  const loginUser = (userData) => {
    justLoggedInRef.current = true;
    setUserState(userData);

    if (userData?.district) {
      setCity(userData.district);
    }
  };

  // 🔄 ADDITION: refresh user after profile update
  const refreshUser = async () => {
    try {
      const res = await axios.get("/current-user");
      const updatedUser = res.data.user;

      setUserState(updatedUser);

      if (updatedUser?.district) {
        setCity(updatedUser.district);
      }
    } catch (err) {
      console.error("❌ Failed to refresh user", err);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/logout");
    } catch {}

    setUserState(null);
    setCity(null);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: loginUser, // 🔥 IMPORTANT (unchanged)
        refreshUser,        // ✅ NEW (used by EditProfile)
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
