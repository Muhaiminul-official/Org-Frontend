import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast'; 
import { MessageSquare, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);

    const SERVICE_ID = 'service_eydgtak';
    const TEMPLATE_ID = 'template_yslsb0a';
    const PUBLIC_KEY = '4aIhCWgKHRwDmG6eg';

 
    toast.promise(
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY),
      {
        loading: 'Sending your message...',
        success: () => {
          setLoading(false);
          formRef.current.reset(); 
          return 'Message sent successfully! 🚀';
        },
        error: err => {
          setLoading(false);
          console.error(err);
          return 'Failed to send message. Please try again.';
        },
      },
      {
        
        style: {
          minWidth: '250px',
          borderRadius: '12px',
          background: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#B91C3C',
            secondary: '#fff',
          },
        },
      },
    );
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B91C3C]/10 border border-[#B91C3C]/20 text-[#B91C3C] text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions? Reach out to our team. We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#B91C3C]/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#B91C3C]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  support@bloodlink.edu
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#B91C3C]/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#B91C3C]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  +880 1883043793
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#B91C3C]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#B91C3C]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Address
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  Khagan, Ashulia, Savar, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#B91C3C]/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#B91C3C]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Support Hours
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  24/7 Emergency Support
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    placeholder="Your name"
                    className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#B91C3C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    required
                    placeholder="you@email.com"
                    className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#B91C3C] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="What's this about?"
                  className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#B91C3C] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="Your message..."
                  className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#B91C3C] transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B91C3C] hover:bg-[#a01832] disabled:bg-gray-400 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
