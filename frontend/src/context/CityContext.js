// import React, { createContext, useState } from 'react';

// export const CityContext = createContext();

// export const CityProvider = ({ children }) => {
//   const [city, setCity] = useState('');

//   return (
//     <CityContext.Provider value={{ city, setCity }}>
//       {children}
//     </CityContext.Provider>
//   );
// };



// import React, { createContext, useEffect, useState } from "react";

// export const CityContext = createContext();

// export const CityProvider = ({ children }) => {
//   const [city, setCity] = useState(() => {
//     // ✅ load from localStorage on refresh
//     return localStorage.getItem("district") || "";
//   });

//   // ✅ persist district whenever it changes
//   useEffect(() => {
//     if (city) {
//       localStorage.setItem("district", city);
//     }
//   }, [city]);

//   return (
//     <CityContext.Provider value={{ city, setCity }}>
//       {children}
//     </CityContext.Provider>
//   );
// };



// import { createContext, useEffect, useState } from "react";

// export const CityContext = createContext();

// export const CityProvider = ({ children }) => {
//   const [city, setCity] = useState(() => {
//     return localStorage.getItem("district") || null;
//   });

//   useEffect(() => {
//     if (city) {
//       localStorage.setItem("district", city);
//     } else {
//       localStorage.removeItem("district");
//     }
//   }, [city]);

//   return (
//     <CityContext.Provider value={{ city, setCity }}>
//       {children}
//     </CityContext.Provider>
//   );
// };


import { createContext, useEffect, useState } from "react";

export const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState(() => {
    return localStorage.getItem("district") || "";
  });

  useEffect(() => {
    if (city) {
      localStorage.setItem("district", city);
    }
  }, [city]);

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};
