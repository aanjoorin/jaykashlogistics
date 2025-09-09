import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import RequestQuote from './pages/RequestQuote';
import OceanFreightQuote from './pages/OceanFreightQuote';
import InlandFreightQuote from './pages/InlandFreightQuote';
import DispatchQuote from './pages/DispatchQuote';
import RequestForms from './pages/RequestForms';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import AdminQuotes from './pages/Admin/Quotes';
import Login from './pages/Login';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/request-quote" element={<RequestQuote />} />
            <Route path="/request-quote/ocean-freight" element={<OceanFreightQuote />} />
            <Route path="/request-quote/inland-freight" element={<InlandFreightQuote />} />
            <Route path="/request-quote/dispatch" element={<DispatchQuote />} />
            <Route path="/book-now/:quoteRef" element={<Booking />} />
            <Route path="/request-forms" element={<RequestForms />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Admin />} />
              <Route path="quotes" element={<AdminQuotes />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;