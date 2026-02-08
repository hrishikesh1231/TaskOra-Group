import React from 'react';
import Hero from './Hero';
import SearchBox from './SearchBox';
import Post from './Post';
import "./HomePage.css";
import Features from './Features';
import Categories from './Categories';
import HeroSection from './HeroSection';
import WhyChooseTaskOra from './WhyChooseTaskOra';
import PopularCategories from './PopularCategories';
import HowItWorks from './HowItWorks';

import TestimonialSection from './TestimonialSection';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* <Hero />
      <SearchBox />
      <Post /> */}
      <HeroSection />
      <WhyChooseTaskOra></WhyChooseTaskOra>
      <PopularCategories></PopularCategories>
      <HowItWorks></HowItWorks>
      <TestimonialSection></TestimonialSection>
      
     
      
    </div>
  );
};

export default HomePage;
