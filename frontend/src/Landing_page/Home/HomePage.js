// import React from 'react';
// import "./HomePage.css";

// import HeroSection from './HeroSection';
// import WhyChooseTaskora from './WhyChooseTaskora';
// import PopularCategories from './PopularCategories';
// import HowItWorks from './HowItWorks';
// import TestimonialSection from './TestimonialSection';

// const HomePage = () => {
//   return (
//     <div className="homepage">

//       <HeroSection />

//       <WhyChooseTaskora />

//       <PopularCategories />

//       <HowItWorks />

//       <TestimonialSection />

//     </div>
//   );
// };

// export default HomePage;



import React from 'react';
import Hero from './Hero';
import SearchBox from './SearchBox';
import Post from './Post';
import "./HomePage.css";
import Features from './Features';
import Categories from './Categories';
import HeroSection from './HeroSection';
import WhyChooseTaskora from './WhyChooseTaskora';
import PopularCategories from './PopularCategories';


import Testimonials from "./Testimonials";


const HomePage = () => {
  return (
    <div className="homepage">
      {/* <Hero />
      <SearchBox />
      <Post /> */}
      <HeroSection />
      <WhyChooseTaskora />
      <PopularCategories></PopularCategories>
      
      <Testimonials></Testimonials>
      
     
      
    </div>
  );
};

export default HomePage;