import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CHATful - AI Chatbots from Your Knowledge Base</title>
        <meta name="description" content="Build AI-powered chatbots from your documents in minutes. Upload your content, customize your widget, and embed anywhere with one script." />
        <meta property="og:title" content="CHATful - AI Chatbots from Your Knowledge Base" />
        <meta property="og:description" content="Build AI-powered chatbots from your documents in minutes. Upload your content, customize your widget, and embed anywhere with one script." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <HowItWorks />
          <Features />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
