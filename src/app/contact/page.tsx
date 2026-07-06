'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, 
  CheckCircle2, AlertCircle, Sparkles, Send, Loader2 
} from 'lucide-react';
import FlipText from '@/components/FlipText';
import CursorFollower from '@/components/CursorFollower';
import SpotlightNavbar from '@/components/SpotlightNavbar';
import Footer from '@/components/Footer';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  eventType: 'Wedding' | 'Festival' | 'Concert' | 'Corporate' | 'Other' | '';
  eventDate: string;
  venue: string;
  message: string;
  budget: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    venue: '',
    message: '',
    budget: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required.';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Indian Phone format validation: 10 digits, optionally starting with +91 or 91
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^(?:\+?91|0)?[6-9]\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (!form.eventType) newErrors.eventType = 'Please select an event classification.';
    
    if (form.message.trim() && form.message.trim().length < 20) {
      newErrors.message = 'Message must contain at least 20 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <>
      <CursorFollower />
      <SpotlightNavbar />

      <div className="relative min-h-screen bg-black text-white pt-24 select-none pb-20">
        
        {/* HERO TITLE HEADER */}
        <section className="py-20 text-center space-y-3 px-6 bg-gradient-to-b from-purple-950/10 via-black to-black border-b border-white/5">
          <FlipText 
            text="LET'S CREATE TOGETHER" 
            className="text-4xl md:text-6xl font-black uppercase tracking-tight"
          />
          <p className="text-xs sm:text-sm text-zinc-550 font-semibold tracking-[0.2em] uppercase">
            Ready to make your event stage unforgettable?
          </p>
        </section>

        {/* CONTACT & BOOKING FORM SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: FORM (7 columns) */}
          <div className="lg:col-span-7 bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Event Booking Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Your Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Patel"
                        className={`w-full px-4 py-3 bg-black/60 border rounded-xl text-xs text-white focus:outline-none transition-all placeholder-zinc-800 ${
                          errors.name ? 'border-rose-500/50 focus:ring-1 focus:ring-rose-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
                        }`}
                      />
                      {errors.name && <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleInputChange}
                        placeholder="e.g. rahul@gmail.com"
                        className={`w-full px-4 py-3 bg-black/60 border rounded-xl text-xs text-white focus:outline-none transition-all placeholder-zinc-800 ${
                          errors.email ? 'border-rose-500/50 focus:ring-1 focus:ring-rose-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
                        }`}
                      />
                      {errors.email && <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div className="space-y-1 relative">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Mobile Number *</label>
                      <input 
                        type="text" 
                        name="phone" 
                        value={form.phone} 
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-4 py-3 bg-black/60 border rounded-xl text-xs text-white focus:outline-none transition-all placeholder-zinc-800 ${
                          errors.phone ? 'border-rose-500/50 focus:ring-1 focus:ring-rose-500' : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
                        }`}
                      />
                      {errors.phone && <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</span>}
                    </div>

                    {/* Event Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Event Stage Classification *</label>
                      <select 
                        name="eventType" 
                        value={form.eventType} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-xl text-xs text-zinc-400 focus:outline-none cursor-pointer ${
                          errors.eventType ? 'border-rose-500/50' : 'border-white/10'
                        }`}
                      >
                        <option value="">Choose Category...</option>
                        <option value="Wedding">Wedding / Sangeet</option>
                        <option value="Festival">Festivals & Garba</option>
                        <option value="Concert">Concerts & Concert Stages</option>
                        <option value="Corporate">Corporate Meets</option>
                        <option value="Other">Other Events</option>
                      </select>
                      {errors.eventType && <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.eventType}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                    {/* Event Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Event Date</label>
                      <input 
                        type="date" 
                        name="eventDate" 
                        value={form.eventDate} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    {/* Budget */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estimated Budget Limit (₹)</label>
                      <input 
                        type="text" 
                        name="budget" 
                        value={form.budget} 
                        onChange={handleInputChange}
                        placeholder="e.g. 1.5 Lakhs"
                        className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none placeholder-zinc-800"
                      />
                    </div>
                  </div>

                  {/* Venue Address */}
                  <div className="space-y-1 border-t border-white/5 pt-4">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Shoot Venue / Event Address</label>
                    <input 
                      type="text" 
                      name="venue" 
                      value={form.venue} 
                      onChange={handleInputChange}
                      placeholder="e.g. Studio 5, Film City, Goregaon"
                      className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none placeholder-zinc-800"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Message Details (Optional)</label>
                    <textarea 
                      name="message" 
                      rows={3}
                      value={form.message} 
                      onChange={handleInputChange}
                      placeholder="e.g. Let us know if you require specific sound, lighting structures, generators or line arrays..."
                      className={`w-full px-4 py-3 bg-black/60 border rounded-xl text-xs text-white focus:outline-none placeholder-zinc-800 ${
                        errors.message ? 'border-rose-500/50' : 'border-white/10'
                      }`}
                    />
                    {errors.message && <span className="text-[9px] font-bold text-rose-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#9462ff] hover:to-[#ff58ad] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/15"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Submitting Lead...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Booking Request
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                /* SUCCESS SCREEN ANIMATION */
                <motion.div 
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center space-y-6 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">INQUIRY SUBMITTED!</h3>
                    <p className="text-xs text-zinc-550 max-w-sm mx-auto font-semibold leading-relaxed">
                      Thank you for contacting Kadam Production. Our event manager will check availability and call you shortly.
                    </p>
                  </div>

                  <button
                    onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', eventType: '', eventDate: '', venue: '', message: '', budget: '' }); }}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT: CARDS & INFO (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact details */}
            <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-3xl shadow-lg space-y-6">
              <h3 className="text-md font-bold uppercase tracking-wider text-white pb-3 border-b border-white/5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Quick Contact Details
              </h3>

              <ul className="space-y-6 text-xs font-semibold">
                {/* Phones */}
                <li className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mb-0.5">Ring Us</div>
                    <a href="tel:+919537330003" className="text-white hover:underline block text-sm font-bold">+91 9537330003</a>
                    <a href="tel:+918866655651" className="text-zinc-500 hover:underline block mt-1">+91 8866655651</a>
                  </div>
                </li>

                {/* Email */}
                <li className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mb-0.5">Email Leads</div>
                    <a href="mailto:kadamproduction123@gmail.com" className="text-white hover:underline block text-sm font-bold">
                      kadamproduction123@gmail.com
                    </a>
                  </div>
                </li>

                {/* Location */}
                <li className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mb-0.5">Corporate HQ</div>
                    <span className="text-white text-sm font-bold">Gujarat, India</span>
                    <span className="block text-zinc-550 text-[10px] mt-1 font-semibold uppercase">Service Areas: All India</span>
                  </div>
                </li>

                {/* Hours */}
                <li className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mb-0.5">Operating Hours</div>
                    <span className="text-white text-sm font-bold">Available 24/7 for Events</span>
                    <span className="block text-zinc-550 mt-1 font-semibold">Office: Mon-Sat, 10AM - 7PM</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Simulated Dark Themed Map Container */}
            <div className="relative aspect-video w-full bg-[#080808] border border-white/5 rounded-3xl overflow-hidden shadow-lg p-6 flex flex-col justify-end">
              <div className="absolute inset-0 opacity-20 pointer-events-none" 
                   style={{
                     backgroundImage: 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 80%), repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.01) 10px, rgba(255,255,255,0.01) 11px)'
                   }}
              />
              <div className="relative z-10 space-y-1.5">
                <h4 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  Gujarat Operations Hub
                </h4>
                <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Serving Mumbai, Delhi, Rajasthan, and major metros nationwide.</p>
              </div>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
