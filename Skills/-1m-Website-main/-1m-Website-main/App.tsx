
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Brands from './components/Brands';
import ValueProps from './components/ValueProps';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import BookingCalendar from './components/BookingCalendar';
import Footer from './components/Footer';
import BlogPage from './components/BlogPage';
import ArticlePage from './components/ArticlePage';
import HomePageSEO from './components/HomePageSEO';

const HomePage: React.FC = () => {
  return (
    <>
      <HomePageSEO />
      <Hero />
      <Brands />
      <ValueProps />
      <Testimonials />
      <ContactForm />
      <BookingCalendar />
    </>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
