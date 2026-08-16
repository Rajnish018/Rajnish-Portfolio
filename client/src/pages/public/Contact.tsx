import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Fixed import name from 'motion/react'
import { Mail, MapPin, Send, Github, Linkedin, Dribbble, Twitter } from 'lucide-react';
import { sendMessageApi } from '@/src/services/apiService';
import { useToast } from '@/src/contexts/ToastContext';
import SEO from '@/src/components/SEO';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.name || form.name.length < 2) newErrors.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.subject || form.subject.length < 5) newErrors.subject = 'Subject is required';
    if (!form.message || form.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    if (Object.keys(newErrors).length > 0) {
      showToast(Object.values(newErrors)[0] as string, "error");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const res = await sendMessageApi(form);
      if (res?.message === "Message sent successfully") {
        setForm({ name: '', email: '', subject: '', message: '' });
        showToast("Message sent successfully!", "success");
        setTimeout(() => {
          showToast("I will get back to you within 24-48 hours.", "info");
        }, 2000);
      }
    } catch (err) {
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SEO
      title="Contact Rajnish Kumar | Hire Full Stack & AI Developer | Next.js, React"
      description="Get in touch with Rajnish Kumar, a Full Stack and AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning. Available for freelance, remote projects, and collaborations."
      keywords="contact Rajnish Kumar, hire full stack developer, AI developer contact, next.js developer hire, react developer freelance, machine learning engineer contact"
      url="https://rajnish-kumar-portfolio.vercel.app/contact"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-6 pb-12 md:pb-20 max-w-7xl mx-auto overflow-x-hidden">
        {/* Header Section */}
        <header className="mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] md:text-[10px] uppercase tracking-widest mb-6 md:mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
            Available for New Projects
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-6 md:mb-8">
            Let&apos;s <span className="accent-gradient">Connect</span>
          </h1>

          <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            Building the future of digital experiences through clean code and architectural precision. Have a project in mind or just want to chat?
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form Section */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-12 order-2 lg:order-1"
          >
            <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-base md:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-base md:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-base md:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your vision..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all resize-none text-base md:text-sm"
                />
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-4 md:py-5 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center transition-all bg-accent text-white hover:bg-accent/80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : (
                  <>Send Message <Send size={18} className="ml-3" /></>
                )}
              </button>
            </form>
          </motion.section>

          {/* Info Sidebar Section */}
          <div className="space-y-8 md:space-y-12 order-1 lg:order-2">
            {/* Contact Details */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 md:p-10"
            >
              <h3 className="text-xl md:text-2xl font-display font-bold mb-8">Contact Details</h3>
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-5 md:gap-6 group">
                  <div className="p-3 md:p-4 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <Mail size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Email</p>
                    <p className="text-sm md:text-lg font-medium truncate">rajnish.kumar.018001@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 md:gap-6 group">
                  <div className="p-3 md:p-4 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Location</p>
                    <p className="text-sm md:text-lg font-medium">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </motion.section>

            
            {/* Image Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative rounded-3xl overflow-hidden aspect-16/10 sm:aspect-video lg:aspect-square xl:aspect-video glass-card"
            >
              <img
                src="https://picsum.photos/seed/remote/1200/800"
                alt="Remote Office"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center px-3 py-1 rounded-full bg-accent/80 backdrop-blur-md text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white">
                <MapPin size={12} className="mr-2" /> Available for Remote
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SEO>
  );
};