import React from "react";
import { motion } from "framer-motion";

import TopNav from "../components/TopNav.jsx";
import Herosection from "../components/Herosection.jsx";
import Howitworks from "../components/Howitworks.jsx";
import Footer from "../components/Footer.jsx";
import PopularItems from "../components/PopularItems.jsx";
import FeaturedRestaurants from "../components/FeaturedRestaurants.jsx";
import DealCard from "../components/DealCard.jsx";
import SmoothScrollProvider from "../utils/SmoothScrollProvider.jsx";
import DiscountSection from "../components/Discountsection.jsx";
import GalleryPage from "./GalleryPage.jsx";
import SubscriptionPlans from "../components/SubscriptionPlans.jsx";
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const LandingPage = ({ onLoginClick, onSignupClick, disableButtons }) => {
  return (
    <>
      <SmoothScrollProvider>
        {/* Top Navigation */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <TopNav onLoginClick={onLoginClick} onSignupClick={onSignupClick} disableButtons={disableButtons} />
        </motion.div>

        {/* Hero Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Herosection />
        </motion.div>

        {/* Gallery Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GalleryPage />
        </motion.div>

        {/* Popular item section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <PopularItems />
        </motion.div>
        
        {/* Featured Restaurants */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeaturedRestaurants />
        </motion.div>


        {/* Discount Sectiom */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <DiscountSection />
        </motion.div>

        {/* How it Works */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Howitworks />
        </motion.div>

        
        
        {/*Subscription Section  */}
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SubscriptionPlans />
        </motion.div>


        {/* Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Footer />
        </motion.div>
      </SmoothScrollProvider>
    </>
  );
};

export default LandingPage;
