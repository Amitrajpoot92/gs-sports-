import React from "react";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyChooseUs from "../components/home/WhyChooseUs";
import OfferBanner from "../components/home/OfferBanner";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <div>

      <Hero />

      <Categories />

      <FeaturedProducts />

      <WhyChooseUs />

      <OfferBanner />

      <CTA />

    </div>
  );
};

export default Home;