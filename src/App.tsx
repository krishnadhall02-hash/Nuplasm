/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Search, Brain, Video, ArrowRight, ChevronRight, Phone, MessageSquare, Mail, ShieldCheck, Clock, Plus, Home, Calendar, FileText, User, MessageCircle, Upload, MoreHorizontal, Bell, Paperclip, Send, CheckCheck, Mic, MicOff, VideoOff, PhoneOff, Maximize2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';

type AppView = 'splash' | 'onboarding' | 'login' | 'otp' | 'dashboard' | 'chat' | 'newCase' | 'caseDetail' | 'doctorProfile' | 'videoCall' | 'uploadReport';

export default function App() {
  const [view, setView] = useState<AppView>('splash');
  const [activeSlide, setActiveSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [activeTab, setActiveTab] = useState('home');
  const [caseFilter, setCaseFilter] = useState('all');
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, size: string, type: 'pdf' | 'img'}[]>([]);

  const mockCases = [
    { id: '1', title: 'ACL Reconstruction', type: 'Orthopedic', status: 'In Progress', date: 'Mar 12, 2024', doctor: 'Dr. Sarah Mitchell', description: 'Complete tear of the anterior cruciate ligament in the left knee requiring surgical reconstruction using hamstring graft.' },
    { id: '2', title: 'Cardiac Consultation', type: 'Cardiac', status: 'Assigned', date: 'Apr 02, 2024', doctor: 'Dr. James Wilson', description: 'Follow-up for reported chest tightness and fatigue. Pre-surgical cardiac clearance required.' },
    { id: '3', title: 'Neural Assessment', type: 'Neurology', status: 'Pending', date: 'Apr 25, 2024', doctor: 'Awaiting Match', description: 'Chronic migraine investigation and neuro-surgical evaluation of persistent ocular pressure.' },
  ];
  const [chatHistory, setChatHistory] = useState([
    { id: 1, role: 'ai', text: "Hello Krishna! I'm SurgiBot, your personal care assistant. How can I help you with your recovery today?", time: '09:41' }
  ]);
  const [caseStep, setCaseStep] = useState(1);
  const [caseForm, setCaseForm] = useState({
    type: '',
    symptoms: '',
    files: [] as string[]
  });
  const [selectedCase, setSelectedCase] = useState(mockCases[0]);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const surgeryTypes = [
    { id: 'orthopedic', label: 'Orthopedic', icon: '🦴' },
    { id: 'cardiac', label: 'Cardiac', icon: '❤️' },
    { id: 'neurology', label: 'Neurology', icon: '🧠' },
    { id: 'general', label: 'General Surgery', icon: '🏥' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (view === 'chat') {
      scrollToBottom();
    }
  }, [chatHistory, view, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const userMsg = { id: Date.now(), role: 'user', text, time: timeString };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiTime = new Date();
      const aiTimeString = `${aiTime.getHours().toString().padStart(2, '0')}:${aiTime.getMinutes().toString().padStart(2, '0')}`;
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: "I've noted that down. Would you like me to share this update with Dr. Mitchell for your assessment?",
        time: aiTimeString
      };
      setIsTyping(false);
      setChatHistory(prev => [...prev, aiMsg]);
    }, 2000);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFiles(prevFiles => [
            ...prevFiles, 
            { name: `Report_Scan_${idxRef.current}.pdf`, size: '2.4 MB', type: 'pdf' }
          ]);
          idxRef.current++;
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const idxRef = useRef(1);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => {
        setView('onboarding');
      }, 3500); 
      return () => clearTimeout(timer);
    }
  }, [view]);

  const onboardingData = [
    {
      title: "Find the Right Surgeon Instantly",
      description: "Connect with board-certified specialists tailored to your specific surgical needs and location.",
      icon: <Search className="w-12 h-12 text-blue-600" />,
      color: "bg-blue-50",
      accent: "text-blue-600"
    },
    {
      title: "AI-Powered Diagnosis & Matching",
      description: "Our advanced algorithms analyze your case to match you with surgeons who have the highest success rates.",
      icon: <Brain className="w-12 h-12 text-indigo-600" />,
      color: "bg-indigo-50",
      accent: "text-indigo-600"
    },
    {
      title: "Video Consultation & Full Care",
      description: "Book virtual appointments and manage your entire recovery journey from the palm of your hand.",
      icon: <Video className="w-12 h-12 text-teal-600" />,
      color: "bg-teal-50",
      accent: "text-teal-600"
    }
  ];

  const nextSlide = useCallback(() => {
    if (activeSlide < onboardingData.length - 1) {
      setActiveSlide(prev => prev + 1);
    } else {
      setView('login');
    }
  }, [activeSlide, onboardingData.length]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-white z-50 absolute inset-0"
          >
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative mb-8"
            >
              <div className="bg-blue-50 p-6 rounded-3xl shadow-sm border border-blue-100/50">
                <Stethoscope className="w-16 h-16 text-blue-600 drop-shadow-sm" strokeWidth={1.5} />
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-blue-400 rounded-3xl -z-10 blur-xl"
              />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-semibold tracking-tight text-slate-900 mb-2"
            >
              SurgiCare
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.6 }}
              transition={{ delay: 0.7 }}
              className="text-sm uppercase tracking-[0.2em] font-medium text-slate-500"
            >
              Smart Surgical Care
            </motion.p>

            <div className="mt-16 w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ 
                  duration: 2.5, 
                  ease: "easeInOut",
                  repeat: Infinity
                }}
                className="absolute inset-0 bg-blue-600 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {view === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-white"
          >
            {/* Top Navigation */}
            <div className="flex justify-between items-center p-6 sm:p-8">
              <div className="flex gap-1.5">
                {onboardingData.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 transition-all duration-300 rounded-full ${i === activeSlide ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => setView('login')}
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
                id="skip-button"
              >
                Skip
              </button>
            </div>

            {/* Slide Content */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col px-8 pb-12"
                >
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full ${onboardingData[activeSlide].color} flex items-center justify-center relative shadow-inner`}
                    >
                      <div className="absolute inset-0 rounded-full border border-current pointer-events-none opacity-10 animate-[spin_20s_linear_infinite]" />
                      <div className="absolute inset-4 rounded-full border border-dashed border-current pointer-events-none opacity-20 animate-[spin_30s_linear_infinite_reverse]" />
                      
                      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl transform rotate-3">
                        {onboardingData[activeSlide].icon}
                      </div>
                    </motion.div>
                  </div>

                  <div className="max-w-md mx-auto text-center mt-8">
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4"
                    >
                      {onboardingData[activeSlide].title}
                    </motion.h2>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-500 leading-relaxed text-lg"
                    >
                      {onboardingData[activeSlide].description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="p-8 pb-12 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextSlide}
                id="next-button"
                className="w-full max-w-md bg-slate-900 text-white rounded-2xl p-5 font-semibold flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all group"
              >
                <span>{activeSlide === onboardingData.length - 1 ? "Get Started" : "Continue"}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col p-8 bg-white"
          >
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <div className="mb-12">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500">Enter your phone number to continue with SurgiCare.</p>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Phone Number</label>
                  <div className="flex items-center bg-slate-50 border-2 border-slate-100 group-focus-within:border-blue-500 group-focus-within:bg-white rounded-2xl p-4 transition-all duration-200 shadow-sm">
                    <Phone className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-slate-900 font-medium mr-2">+1</span>
                    <input 
                      type="tel" 
                      placeholder="Enter mobile number" 
                      className="bg-transparent border-none outline-none text-lg font-medium w-full text-slate-900 placeholder:text-slate-300"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      id="phone-input"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setView('otp')}
                  disabled={!phoneNumber}
                  className="w-full bg-slate-900 text-white rounded-2xl p-5 font-semibold flex items-center justify-center gap-3 shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  id="whatsapp-otp-button"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Send OTP via WhatsApp</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-400 font-medium tracking-widest">Or login with</span>
                  </div>
                </div>

                <button 
                  className="w-full border-2 border-slate-100 text-slate-600 rounded-2xl p-5 font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                  id="email-login-button"
                >
                  <Mail className="w-5 h-5" />
                  <span>Continue with Email</span>
                </button>
              </div>
            </div>

            <p className="text-center text-slate-400 text-sm mt-8">
              By continuing, you agree to our <span className="text-blue-600 font-medium">Terms</span> & <span className="text-blue-600 font-medium">Privacy Policy</span>
            </p>
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-8 bg-white"
          >
            <button 
               onClick={() => setView('login')}
               className="p-3 w-fit hover:bg-slate-50 rounded-xl transition-colors mb-6"
            >
              <ArrowRight className="w-6 h-6 rotate-180 text-slate-600" />
            </button>

            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
              <div className="mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Account</h2>
                <p className="text-slate-500">We've sent a 6-digit code to <span className="font-semibold text-slate-900">+1 {phoneNumber}</span> via WhatsApp.</p>
              </div>

              <div className="flex justify-between gap-2 max-w-sm mx-auto mb-10">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('dashboard')}
                  disabled={otp.some(d => !d)}
                  className="w-full bg-slate-900 text-white rounded-2xl p-5 font-semibold shadow-lg shadow-slate-100 hover:bg-slate-800 transition-all disabled:opacity-50"
                  id="verify-otp-button"
                >
                  Verify Now
                </motion.button>

                <div className="flex flex-col items-center gap-4">
                  {timer > 0 ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>Resend code in {timer}s</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setTimer(30)}
                      className="text-blue-600 font-semibold text-sm hover:underline"
                      id="resend-otp-button"
                    >
                      Resend OTP code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'uploadReport' && (
          <motion.div
            key="uploadReport"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="flex-1 flex flex-col bg-white overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 pt-10 sticky top-0 bg-white z-20 flex items-center justify-between">
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <ArrowRight className="w-6 h-6 rotate-180 text-slate-800" />
              </button>
              <h3 className="font-bold text-slate-900">Upload Records</h3>
              <div className="w-10"></div>
            </div>

            <div className="p-8 flex-1 flex flex-col space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Import Documents</h2>
                <p className="text-slate-500">Quickly upload scans, MRI, or X-rays for instant AI analysis.</p>
              </div>

              {/* Upload Area */}
              <motion.div
                whileHover={{ borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgb(248, 250, 252)' }}
                onClick={simulateUpload}
                className="border-3 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all group relative overflow-hidden"
              >
                {isUploading && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="absolute bottom-0 left-0 h-1.5 bg-blue-600 z-10"
                  />
                )}
                <div className={`w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center transition-transform duration-500 ${isUploading ? 'scale-110 animate-pulse' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                  <Upload className={`w-10 h-10 ${isUploading ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 mb-1">
                    {isUploading ? `Uploading... ${uploadProgress}%` : "Drop records here"}
                  </p>
                  <p className="text-slate-400 text-sm font-medium">Or tap to browse your library</p>
                </div>
              </motion.div>

              {/* File List */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-2 px-2">Uploaded Files</h4>
                <AnimatePresence>
                  {uploadedFiles.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 border-2 border-slate-50 rounded-3xl flex flex-col items-center gap-3 text-slate-300"
                    >
                      <FileText className="w-8 h-8 opacity-20" />
                      <span className="text-xs font-bold uppercase tracking-widest">No files yet</span>
                    </motion.div>
                  ) : (
                    uploadedFiles.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 group"
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${file.type === 'pdf' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 text-sm leading-tight mb-0.5">{file.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.size}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setUploadedFiles(prev => prev.filter((_, idx) => idx !== i));
                          }}
                          className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Plus className="w-5 h-5 rotate-45" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Submit CTA */}
              {uploadedFiles.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setView('dashboard')}
                  className="w-full bg-slate-900 text-white rounded-[2rem] p-6 font-bold shadow-2xl shadow-slate-200 mt-auto hover:bg-slate-800 transition-all"
                >
                  Confirm Upload
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {view === 'videoCall' && (
          <motion.div
            key="videoCall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-slate-900 relative h-screen"
          >
            {/* Main Video (Doctor) */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop" 
                alt="Doctor View" 
                className={`w-full h-full object-cover transition-all duration-700 ${isCameraOff ? 'blur-2xl opacity-40' : 'opacity-80'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </div>

            {/* Header Info */}
            <div className="relative z-10 p-8 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold leading-none mb-1">Dr. Sarah Mitchell</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Encrypted Call</span>
                  </div>
                </div>
              </div>
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* User PiP (Picture in Picture) */}
            <motion.div 
               drag
               dragConstraints={{ left: 20, right: 300, top: 20, bottom: 500 }}
               className="absolute top-32 right-6 w-32 h-44 bg-slate-800 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 cursor-move"
            >
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=300&fit=crop" 
                alt="My View" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                 <span className="text-white text-[10px] font-bold uppercase tracking-widest leading-none">Self View</span>
              </div>
            </motion.div>

            {/* Bottom Controls */}
            <div className="absolute bottom-16 inset-x-0 z-30 flex flex-col items-center gap-8">
              <div className="flex items-center gap-6">
                <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setIsMuted(!isMuted)}
                   className={`w-16 h-16 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border-2 transition-all ${isMuted ? 'bg-red-500/80 border-red-400 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>

                <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setView('dashboard')}
                   className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-600/40 border-4 border-red-500/30 active:translate-y-1 transition-all"
                   id="end-call"
                >
                  <PhoneOff className="w-8 h-8" />
                </motion.button>

                <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setIsCameraOff(!isCameraOff)}
                   className={`w-16 h-16 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border-2 transition-all ${isCameraOff ? 'bg-slate-700/80 border-slate-600 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                >
                  {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </motion.button>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/80 text-xs font-bold uppercase tracking-[0.2em]"
              >
                12:45
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col bg-slate-50"
          >
            {/* Chat Header */}
            <div className="p-6 pt-10 sticky top-0 bg-white shadow-sm border-b border-slate-100 z-20 flex items-center gap-4">
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors"
                id="chat-back"
              >
                <ArrowRight className="w-6 h-6 rotate-180 text-slate-800" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">SurgiBot AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Online Specialist</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`max-w-[85%] p-4 rounded-3xl shadow-sm relative group ${
                    msg.role === 'ai' 
                    ? 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-100 shadow-slate-200/50' 
                    : 'bg-slate-900 text-white self-end rounded-tr-none shadow-xl shadow-slate-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed mb-1">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 ${msg.role === 'ai' ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{msg.time}</span>
                    {msg.role === 'user' && <CheckCheck className="w-3 h-3 text-blue-400" />}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 self-start flex gap-1 items-center"
                >
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies & Input */}
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              {/* Quick Replies */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {["Pain levels?", "Next appointment?", "Upload meds"].map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 border border-slate-100 rounded-full text-xs font-bold hover:border-blue-200 hover:text-blue-600 transition-all shrink-0 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Text Input Control */}
              <div className="flex items-center gap-3">
                <button 
                  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                  id="chat-attach"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-blue-500 focus-within:bg-white rounded-2xl px-4 py-1 transition-all shadow-inner">
                   <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none p-3 text-sm font-medium text-slate-900 placeholder:text-slate-300"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatMessage)}
                      id="chat-input"
                   />
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMessage(chatMessage)}
                  disabled={!chatMessage.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-50 disabled:bg-slate-200 disabled:shadow-none transition-all group"
                  id="send-chat"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'newCase' && (
          <motion.div
            key="newCase"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="flex-1 flex flex-col bg-white overflow-y-auto"
          >
            {/* Header with Progress Bar */}
            <div className="sticky top-0 bg-white z-20">
              <div className="p-6 pt-10 flex items-center justify-between">
                <button 
                  onClick={() => caseStep > 1 ? setCaseStep(s => s - 1) : setView('dashboard')}
                  className="p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <ArrowRight className="w-6 h-6 rotate-180 text-slate-800" />
                </button>
                <h3 className="font-bold text-slate-900">New Application</h3>
                <div className="w-10"></div>
              </div>
              <div className="px-6 pb-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  <span>Step {caseStep} of 3</span>
                  <span>{Math.round((caseStep / 3) * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${(caseStep/3)*100}%` }}
                    className="h-full bg-blue-600" 
                  />
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                {caseStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Surgery Type</h2>
                      <p className="text-slate-500">Pick the category that best describes your needs.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {surgeryTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setCaseForm({ ...caseForm, type: type.id });
                            setCaseStep(2);
                          }}
                          className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4 text-left ${
                            caseForm.type === type.id 
                            ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' 
                            : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <span className="text-3xl">{type.icon}</span>
                          <span className="font-bold text-slate-900">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {caseStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Describe Symptoms</h2>
                      <p className="text-slate-500">Provide details about your pain, duration, and any previous injuries.</p>
                    </div>
                    <textarea
                      placeholder="Type your symptoms here..."
                      className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900 font-medium resize-none shadow-sm"
                      value={caseForm.symptoms}
                      onChange={(e) => setCaseForm({ ...caseForm, symptoms: e.target.value })}
                    />
                    <button
                      disabled={!caseForm.symptoms}
                      onClick={() => setCaseStep(3)}
                      className="w-full bg-slate-900 text-white p-5 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50"
                    >
                      Next Step
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {caseStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Reports</h2>
                      <p className="text-slate-500">Provide any MRI, X-Ray, or previous medical reports for AI assessment.</p>
                    </div>
                    
                    <div className="border-3 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all group cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <span className="text-slate-900 font-bold">Tap to upload files</span>
                      <span className="text-slate-400 text-xs">PDF, JPG or DICOM (Max 50MB)</span>
                    </div>

                    <div className="pt-8">
                       <button
                        onClick={() => {
                          setView('dashboard');
                          setCaseStep(1);
                        }}
                        className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all"
                        id="submit-case"
                      >
                        Submit Application
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {view === 'doctorProfile' && (
          <motion.div
            key="doctorProfile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col bg-white overflow-y-auto pb-32"
          >
            {/* Immersive Header Image */}
            <div className="relative h-[45vh] w-full bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=800&fit=crop" 
                alt="Dr. Sarah Mitchell" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <button 
                onClick={() => setView('caseDetail')}
                className="absolute top-10 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/30 hover:bg-white/40 transition-colors"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>

              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">Top Specialist</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-bold">4.9 (1.2k Reviews)</span>
                  </div>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Dr. Sarah Mitchell</h2>
                <p className="text-white/80 font-medium tracking-wide">Orthopedic & Sports Surgeon</p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 -mt-6 rounded-t-[3rem] bg-white relative z-10 pt-10 space-y-8">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Experience', val: '12 yr', icon: Clock, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Patients', val: '4.5k+', icon: User, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Rating', val: '4.9', icon: ShieldCheck, color: 'bg-amber-50 text-amber-600' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className={`p-2 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{stat.val}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Bio Section */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">About the Specialist</h3>
                <p className="text-slate-500 leading-relaxed">
                  Dr. Sarah Mitchell is a globally recognized board-certified orthopedic surgeon specializing in minimally invasive knee and shoulder reconstructions. With over 12 years of experience at St. Jude Medical Center, she pioneered the accelerated recovery protocol for athletes.
                </p>
              </section>

              {/* Specializations Tags */}
              <section>
                <div className="flex flex-wrap gap-2">
                  {['ACL Reconstruction', 'Joint Replacement', 'Sports Medicine', 'Cartilage Repair', 'Arthroscopy'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

              {/* Education / Credentials */}
              <section className="pb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Education</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Harvard Medical School</h5>
                      <p className="text-xs text-slate-400">Doctor of Medicine (M.D.) • 2008-2012</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Johns Hopkins University</h5>
                      <p className="text-xs text-slate-400">Surgical Residency • 2012-2016</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 inset-x-0 p-8 pt-4 pb-12 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('chat')}
                className="w-full bg-blue-600 text-white rounded-[2rem] p-6 font-bold flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all group"
              >
                <span>Start Consultation</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {view === 'caseDetail' && (
          <motion.div
            key="caseDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-slate-50 overflow-y-auto pb-32"
          >
            {/* Header */}
            <div className="p-6 pt-10 sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 flex items-center justify-between">
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 -ml-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-slate-100"
              >
                <ArrowRight className="w-6 h-6 rotate-180 text-slate-800" />
              </button>
              <h3 className="font-bold text-slate-900">Application Details</h3>
              <button className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-100">
                <MoreHorizontal className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="px-6 space-y-6">
              {/* Case Summary Card */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2">{selectedCase.type}</span>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedCase.title}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedCase.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                    selectedCase.status === 'Assigned' ? 'bg-teal-50 text-teal-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {selectedCase.status}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pb-6 border-b border-slate-50">
                  {selectedCase.description}
                </p>
                <div className="pt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>ID: #SURG-2024-{selectedCase.id}</span>
                  </div>
                  <span>Applied on {selectedCase.date}</span>
                </div>
              </motion.section>

              {/* Assigned Doctor Section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setView('doctorProfile')}
                className="cursor-pointer group"
              >
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Primary Care Lead</h4>
                <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white overflow-hidden relative shadow-xl shadow-slate-200 group-hover:bg-slate-800 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-400/20 transition-colors"></div>
                   <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700">
                      <img 
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" 
                        alt={selectedCase.doctor} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{selectedCase.doctor}</h4>
                      <p className="text-slate-400 text-sm">Consulting Specialist</p>
                      <div className="flex items-center gap-1 mt-1 text-blue-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Expert Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Timeline Status */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Care Journey Progress</h4>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative">
                  {[
                    { label: 'Initial Assessment', state: 'completed', date: 'Mar 12' },
                    { label: 'Surgical Consultation', state: 'completed', date: 'Mar 15' },
                    { label: 'Pre-surgery Evaluation', state: 'active', date: 'In Progress' },
                    { label: 'Surgical Day', state: 'upcoming', date: 'TBD' },
                    { label: 'Post-Op Recovery', state: 'upcoming', date: 'TBD' }
                  ].map((step, idx, arr) => (
                    <div key={idx} className="flex gap-4 min-h-[60px] relative">
                      {/* Connector Line */}
                      {idx !== arr.length - 1 && (
                        <div className={`absolute left-[11px] top-[24px] w-[2px] h-full ${step.state === 'completed' ? 'bg-blue-600' : 'bg-slate-100'}`} />
                      )}
                      
                      {/* Indicator Dot */}
                      <div className="relative z-10 pt-1">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          step.state === 'completed' ? 'bg-blue-600 border-blue-600' : 
                          step.state === 'active' ? 'bg-white border-blue-600' : 
                          'bg-white border-slate-100'
                        }`}>
                          {step.state === 'completed' && <ArrowRight className="w-3 h-3 text-white" />}
                          {step.state === 'active' && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                        </div>
                      </div>

                      <div className="flex-1 pb-8">
                        <h5 className={`text-sm font-bold ${step.state === 'upcoming' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</h5>
                        <p className={`text-[10px] font-medium uppercase tracking-wider ${step.state === 'active' ? 'text-blue-600' : 'text-slate-400'}`}>{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Reports Section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4 ml-4">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Documentation</h4>
                   <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">View All</button>
                </div>
                <div className="space-y-3">
                  {['MRI Scan Report', 'Blood Panel Results'].map((report, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-slate-800">{report}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">PDF • 2.4 MB • MAR 14</p>
                      </div>
                      <button className="p-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-5 h-5 -rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 inset-x-0 p-6 pb-12 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex gap-4 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
                <button 
                   onClick={() => setView('chat')}
                   className="flex-1 bg-slate-900 text-white rounded-2xl p-5 font-bold flex items-center justify-center gap-3 shadow-xl transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Assistant
                </button>
                <button 
                   onClick={() => setView('videoCall')}
                   className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 animate-bounce-slow"
                >
                   <Video className="w-6 h-6" />
                </button>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col relative pb-24"
          >
            {/* Fixed Header */}
            <div className="p-6 pt-10 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 flex justify-between items-start">
              <div>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-slate-500 text-sm font-medium mb-1"
                >
                  Good morning,
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-slate-900 tracking-tight"
                >
                  Krishna
                </motion.h2>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 relative"
              >
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </motion.button>
            </div>

            {/* Content Scroll Area */}
            <div className="px-6 space-y-6 pb-6 overflow-y-auto flex-1">
              {activeTab === 'home' && (
                <>
                  {/* Active Case Card */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => {
                        setSelectedCase(mockCases[0]);
                        setView('caseDetail');
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200 transition-transform group-active:scale-[0.98]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl text-blue-500 group-hover:bg-blue-400/20 transition-colors"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                          <span className="px-4 py-1.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider">Active Case</span>
                          <span className="text-slate-400 text-xs">Started Mar 12</span>
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">ACL Reconstruction</h3>
                        <p className="text-slate-400 text-sm mb-6">Pre-Surgery Assessment</p>
                        
                        {/* Progress Indicator */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-blue-400">Phase 2 of 5</span>
                            <span>40% Completed</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "40%" }}
                              transition={{ duration: 1.5, delay: 0.5 }}
                              className="h-full bg-blue-500" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Assigned Doctor Card */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setView('doctorProfile')}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" 
                            alt="Dr. Sarah Mitchell" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">Dr. Sarah Mitchell</h4>
                          <p className="text-slate-500 text-sm">Orthopedic Surgeon</p>
                          <div className="flex items-center gap-1 mt-1 text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-lg">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider italic">Certified Extraordinaire</span>
                          </div>
                        </div>
                        <button className="ml-auto p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-slate-50 text-slate-900 p-4 rounded-2xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          Reschedule
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCase(mockCases[0]);
                            setView('chat');
                          }}
                          className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                           <MessageCircle className="w-4 h-4" />
                           Chat Now
                        </button>
                      </div>
                    </div>
                  </motion.section>

                  {/* Quick Actions Grid */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left active:scale-[0.98] transition-transform"
                        id="book-appointment-btn"
                      >
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">Book<br/>Appointment</span>
                      </button>
                      <button 
                        onClick={() => setView('uploadReport')}
                        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left active:scale-[0.98] transition-transform"
                        id="upload-report-btn"
                      >
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                          <Upload className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">Upload<br/>Medical Report</span>
                      </button>
                    </div>
                  </motion.section>
                </>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="mb-2">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Applications</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {['all', 'Pending', 'Assigned', 'In Progress'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setCaseFilter(filter)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            caseFilter === filter 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                            : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockCases
                      .filter(c => caseFilter === 'all' || c.status === caseFilter)
                      .map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                            setSelectedCase(item as any);
                            setView('caseDetail');
                        }}
                        className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.type}</span>
                            <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                            item.status === 'Assigned' ? 'bg-teal-50 text-teal-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{item.doctor}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {mockCases.filter(c => caseFilter === 'all' || c.status === caseFilter).length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-slate-400 font-medium">No results for this filter.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Your Care Timeline</h3>
                  <p className="text-slate-500 max-w-xs">Follow-ups and therapy sessions will appear here once scheduled.</p>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Patient Profile</h3>
                  <p className="text-slate-500 mb-8">Manage your account settings and medical history.</p>
                  <button 
                    onClick={() => setView('splash')}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Logout Demo
                  </button>
                </div>
              )}
            </div>

            {/* Floating Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('newCase')}
              className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center group z-20"
              id="new-case-fab"
            >
              <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>

            {/* Bottom Tab Bar */}
            <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 pb-8 flex justify-between items-center z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'calendar', icon: Calendar, label: 'Care' },
                { id: 'reports', icon: FileText, label: 'Files' },
                { id: 'profile', icon: User, label: 'Menu' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-1 group relative"
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 group-hover:bg-slate-50'}`}>
                    <tab.icon className="w-6 h-6 shrink-0" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div 
                       layoutId="tab-underline"
                       className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorative Blurs */}
      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-50/50 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
