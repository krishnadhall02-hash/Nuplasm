/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Search, Brain, Video, ArrowRight, ChevronRight, Phone, MessageSquare, Mail, ShieldCheck, Clock, Plus, Home, Calendar, FileText, User, MessageCircle, Upload, MoreHorizontal, Bell, Paperclip, Send, CheckCheck, Mic, MicOff, VideoOff, PhoneOff, Maximize2, Download, Share2, Settings, LogOut, Heart, Info, CreditCard, Star, Camera, Check, File, Key, Fingerprint, LogOut as LogOutIcon } from 'lucide-react';
import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { Button, Card, Header, Container, Badge, SectionTitle, FloatingBanner } from './components/design-system';
import { supabase } from './lib/supabase';

type AppView = 'splash' | 'onboarding' | 'login' | 'otp' | 'dashboard' | 'chat' | 'newCase' | 'caseDetail' | 'doctorProfile' | 'videoCall' | 'uploadReport' | 'booking' | 'payment' | 'receipt' | 'notifications' | 'doctorDashboard' | 'settings' | 'notifSettings' | 'securitySettings' | 'billingHistory' | 'helpSupport' | 'passwordChange';

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
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Appointment Confirmed', message: 'Your session with Dr. Sarah is set for tomorrow at 10:00 AM.', time: '2m ago', read: false, type: 'calendar' },
    { id: 2, title: 'AI Analysis Ready', message: 'Nuplasm AI has finished analyzing your last MRI scan.', time: '1h ago', read: false, type: 'brain' },
    { id: 3, title: 'Exercise Reminder', message: 'Time for your daily knee mobility exercises.', time: '4h ago', read: true, type: 'activity' },
    { id: 4, title: 'Message from Care Team', message: 'We have updated your post-op recovery protocol.', time: 'Yesterday', read: true, type: 'message' },
  ]);
  const [doctorTab, setDoctorTab] = useState<'pre-op' | 'active' | 'post-op'>('active');
  const [settingsToggles, setSettingsToggles] = useState({
    push: true,
    email: false,
    sms: true,
    biometric: true,
    marketing: false
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TKT-101', subject: 'Billing Issue', status: 'Open', date: '2 hours ago' },
    { id: 'TKT-098', subject: 'Video Call Quality', status: 'Resolved', date: '2 days ago' }
  ]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [supportChat, setSupportChat] = useState([
    { id: 1, text: "Hi! How can we help you today?", isBot: true, time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [billingFilter, setBillingFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingData, setBillingData] = useState([
    { id: 'SUR-77291-B', date: 'Apr 28, 2024', amount: '$499.00', status: 'Paid', plan: 'Elite Recovery', receipt_url: '#' },
    { id: 'SUR-76120-A', date: 'Mar 15, 2024', amount: '$199.00', status: 'Paid', plan: 'Essential Care', receipt_url: '#' },
    { id: 'CON-12093-X', date: 'Jan 10, 2024', amount: '$49.00', status: 'Paid', plan: 'Initial Consult', receipt_url: '#' },
    { id: 'PAY-WAI-992', date: 'May 02, 2024', amount: '$299.00', status: 'Pending', plan: 'Post-Op Rehab', receipt_url: null }
  ]);

  useEffect(() => {
    if (view === 'billingHistory') {
      const fetchBilling = async () => {
        setBillingLoading(true);
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('date', { ascending: false });
          
          if (!error && data && data.length > 0) {
            setBillingData(data);
          }
        } catch (e) {
          console.error('Failed to fetch billing:', e);
        } finally {
          setBillingLoading(false);
        }
      };
      fetchBilling();
    }
  }, [view]);

  const mockPatients = [
    { id: 'p1', name: 'James Wilson', procedure: 'ACL Reconstruction', status: 'pre-op', risk: 'Low', date: 'May 14', recovery: 0, avatar: 'JW' },
    { id: 'p2', name: 'Sarah Chen', procedure: 'Hip Replacement', status: 'active', risk: 'Medium', date: 'In Surgery', recovery: 15, avatar: 'SC' },
    { id: 'p3', name: 'Michael Ross', procedure: 'Spinal Fusion', status: 'active', risk: 'High', date: 'Post-Op Day 1', recovery: 22, avatar: 'MR' },
    { id: 'p4', name: 'Emma Thompson', procedure: 'Knee Arthroscopy', status: 'post-op', risk: 'Low', date: 'Week 4', recovery: 78, avatar: 'ET' },
    { id: 'p5', name: 'David Miller', procedure: 'Shoulder Labrum', status: 'post-op', risk: 'Medium', date: 'Week 2', recovery: 45, avatar: 'DM' },
  ];

  const mockCases = [
    { id: '1', title: 'ACL Reconstruction', type: 'Orthopedic', status: 'In Progress', date: 'Mar 12, 2024', doctor: 'Dr. Sarah Mitchell', description: 'Complete tear of the anterior cruciate ligament in the left knee requiring surgical reconstruction using hamstring graft.' },
    { id: '2', title: 'Cardiac Consultation', type: 'Cardiac', status: 'Assigned', date: 'Apr 02, 2024', doctor: 'Dr. James Wilson', description: 'Follow-up for reported chest tightness and fatigue. Pre-surgical cardiac clearance required.' },
    { id: '3', title: 'Neural Assessment', type: 'Neurology', status: 'Pending', date: 'Apr 25, 2024', doctor: 'Awaiting Match', description: 'Chronic migraine investigation and neuro-surgical evaluation of persistent ocular pressure.' },
  ];
  const [chatHistory, setChatHistory] = useState([
    { id: 1, role: 'ai', text: "Hello Krishna! I'm Nuplasm AI, your personal care assistant. How can I help you with your recovery today?", time: '09:41' }
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
              Nuplasm Health Care
            </motion.h1>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.6 }}
              transition={{ delay: 0.7 }}
              className="text-sm uppercase tracking-[0.2em] font-medium text-slate-500"
            >
              Advanced Healthcare Solutions
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
            className="flex-1 flex flex-col bg-white overflow-hidden"
          >
            {/* Top Navigation */}
            <div className="flex justify-between items-center p-8">
              <div className="flex gap-2">
                {onboardingData.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 transition-all duration-300 rounded-full ${i === activeSlide ? 'w-10 bg-primary' : 'w-2 bg-slate-100'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => setView('login')}
                className="text-xs font-black uppercase tracking-widest text-content-muted hover:text-content-primary transition-colors"
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
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col px-8"
                >
                  <div className="flex-[1.5] flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`w-72 h-72 rounded-5xl ${onboardingData[activeSlide].color} flex items-center justify-center relative shadow-inner`}
                    >
                      <div className="absolute inset-0 rounded-5xl border border-current pointer-events-none opacity-5 animate-[spin_40s_linear_infinite]" />
                      <div className="bg-white p-10 rounded-4xl shadow-strong transform rotate-3">
                        {onboardingData[activeSlide].icon}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex-1 max-w-sm mx-auto text-center">
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-black text-content-primary leading-[1.1] mb-6 tracking-tight"
                    >
                      {onboardingData[activeSlide].title}
                    </motion.h2>
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-content-secondary leading-relaxed text-lg font-medium"
                    >
                      {onboardingData[activeSlide].description}
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <FloatingBanner>
              <Button onClick={nextSlide} icon={ChevronRight}>
                {activeSlide === onboardingData.length - 1 ? "Get Started" : "Continue"}
              </Button>
            </FloatingBanner>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col bg-white overflow-hidden"
          >
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-8 px-10">
              <div className="mb-12">
                <div className="w-20 h-20 bg-blue-50 rounded-4xl flex items-center justify-center mb-10 shadow-soft">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black text-content-primary mb-4 tracking-tight">Welcome</h2>
                <p className="text-content-secondary font-medium text-lg leading-relaxed">Enter your phone number to continue your recovery journey.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-content-muted uppercase tracking-[0.2em] ml-2">Phone Number</label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 focus-within:border-primary focus-within:bg-white rounded-2xl p-5 transition-all duration-300">
                    <Phone className="w-6 h-6 text-content-muted mr-4" />
                    <span className="text-content-primary font-black mr-2 text-xl">+1</span>
                    <input 
                      type="tel" 
                      placeholder="000-000-0000" 
                      className="bg-transparent border-none outline-none text-xl font-black w-full text-content-primary placeholder:text-slate-200"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      id="phone-input"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setView('otp')} 
                  disabled={!phoneNumber} 
                  icon={ChevronRight}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Get Verification Code</span>
                </Button>

                <SectionTitle title="Quick Options" />

                <Button variant="ghost" icon={Mail}>
                  Continue with Email
                </Button>
              </div>
            </div>

            <p className="text-center text-content-muted text-[10px] font-bold uppercase tracking-widest pb-12">
              Privacy First • SECURE ENCRYPTION • HIPPA compliant
            </p>
          </motion.div>
        )}

        {view === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-white overflow-hidden"
          >
            <Header title="Verification" onBack={() => setView('login')} />

            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-8 text-center px-10">
              <div className="mb-12">
                <div className="w-20 h-20 bg-blue-50 rounded-4xl flex items-center justify-center mx-auto mb-10 shadow-soft">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-content-primary mb-4 tracking-tight">Security Code</h2>
                <p className="text-content-secondary font-medium leading-relaxed">
                  Enter the 6-digit code sent to <span className="text-content-primary font-black">+1 {phoneNumber}</span>
                </p>
              </div>

              <div className="flex justify-between gap-2 max-w-sm mx-auto mb-12">
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
                    className="w-12 h-16 text-center text-2xl font-black rounded-2xl border border-slate-100 bg-slate-50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-blue-50 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-8">
                <Button 
                  onClick={() => setView('dashboard')} 
                  disabled={otp.some(d => !d)}
                  variant="primary"
                >
                  Verify Now
                </Button>

                <div className="flex flex-col items-center gap-4">
                  {timer > 0 ? (
                    <div className="flex items-center gap-2 text-content-muted text-xs font-black uppercase tracking-widest">
                      <Clock className="w-4 h-4" />
                      <span>Resend in {timer}s</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setTimer(30)}
                      className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:underline"
                      id="resend-otp-button"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'doctorDashboard' && (
          <motion.div
            key="doctorDashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto no-scrollbar"
          >
            {/* Doctor Header */}
            <div className="p-8 pb-6 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-soft">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary rounded-4xl flex items-center justify-center text-white shadow-primary">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dr. Sarah Mitchell</h2>
                    <p className="text-[10px] text-content-muted font-black uppercase tracking-[0.2em] mt-1">Surgical Lead • Orthopedics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView('dashboard')}
                  className="p-4 bg-slate-50 text-content-muted rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Active', value: '12', variant: 'blue' },
                  { label: 'Urgent', value: '3', variant: 'red' },
                  { label: 'Cleared', value: '8', variant: 'emerald' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <Badge variant={stat.variant as any}>{stat.label}</Badge>
                  </div>
                ))}
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-3xl border border-slate-100">
                {(['pre-op', 'active', 'post-op'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDoctorTab(tab)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      doctorTab === tab 
                      ? 'bg-white text-primary shadow-soft' 
                      : 'text-content-muted hover:text-content-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Container className="pb-32">
              <SectionTitle title={`${doctorTab} Patients`} />

              <div className="space-y-4">
                {mockPatients.filter(p => p.status === doctorTab).map((patient) => (
                  <Card
                    key={patient.id}
                    onClick={() => {}}
                    className="p-8"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-50 rounded-3xl flex items-center justify-center font-black text-primary border border-blue-50">
                          {patient.avatar}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-900">{patient.name}</h4>
                          <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-0.5">{patient.procedure}</p>
                        </div>
                      </div>
                      <Badge variant={patient.risk === 'High' ? 'red' : patient.risk === 'Medium' ? 'amber' : 'emerald'}>
                        {patient.risk} Risk
                      </Badge>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-content-muted uppercase tracking-widest">Recovery Progress</p>
                          <p className="text-sm font-black text-primary">{patient.recovery}%</p>
                        </div>
                        <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${patient.recovery}%` }}
                            className={`h-full rounded-full ${
                              patient.recovery > 70 ? 'bg-emerald-500' :
                              patient.recovery > 30 ? 'bg-primary' :
                              'bg-amber-500'
                            } shadow-[0_0_10px_rgba(37,99,235,0.2)]`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-content-muted" />
                            <span className="text-xs font-black text-content-secondary uppercase tracking-widest">{patient.date}</span>
                         </div>
                         <Button variant="ghost" className="w-auto py-3 px-6 text-[10px] uppercase tracking-widest">
                           Open Case
                         </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {mockPatients.filter(p => p.status === doctorTab).length === 0 && (
                <div className="py-24 text-center flex flex-col items-center gap-6">
                   <div className="w-24 h-24 bg-white rounded-5xl shadow-soft flex items-center justify-center text-slate-200">
                      <Search className="w-10 h-10" />
                   </div>
                   <p className="text-xs font-black text-content-muted uppercase tracking-[0.2em]">No patients in this stage</p>
                </div>
              )}
            </Container>
          </motion.div>
        )}

        {view === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto no-scrollbar"
          >
            <Header 
              title="Notifications" 
              onBack={() => setView('dashboard')}
              rightElement={
                <button 
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-primary text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-full transition-all"
                >
                  Mark All
                </button>
              }
            />

            <Container className="pb-32">
              <AnimatePresence mode="popLayout">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                    }}
                    className={`p-6 rounded-4xl border transition-all cursor-pointer relative group mb-3 last:mb-0 ${
                      notif.read 
                      ? 'bg-white/50 border-slate-100 opacity-60' 
                      : 'bg-white border-blue-100 shadow-strong ring-1 ring-blue-50/50'
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute top-8 right-8 w-3 h-3 bg-primary rounded-full shadow-primary" />
                    )}
                    
                    <div className="flex gap-6">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'calendar' ? 'bg-amber-50 text-amber-600' :
                        notif.type === 'brain' ? 'bg-blue-50 text-blue-600' :
                        notif.type === 'activity' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                         {notif.type === 'calendar' && <Calendar className="w-7 h-7" />}
                         {notif.type === 'brain' && <Brain className="w-7 h-7" />}
                         {notif.type === 'activity' && <Clock className="w-7 h-7" />}
                         {notif.type === 'message' && <MessageSquare className="w-7 h-7" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-base font-black tracking-tight ${notif.read ? 'text-content-secondary' : 'text-slate-900'}`}>{notif.title}</h4>
                        </div>
                        <p className={`text-sm leading-relaxed mb-4 ${notif.read ? 'text-content-muted' : 'text-content-secondary font-medium'}`}>
                          {notif.message}
                        </p>
                        <Badge variant="slate">{notif.time}</Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Container>
          </motion.div>
        )}

        {view === 'receipt' && (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center bg-surface-bg p-8 h-screen"
          >
            <Card className="w-full max-w-sm overflow-hidden p-0 flex flex-col">
              {/* Receipt Visuals */}
              <div className="bg-slate-900 p-10 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="w-24 h-24 bg-primary rounded-4xl flex items-center justify-center mx-auto mb-6 border-4 border-slate-800 shadow-primary">
                  <Check className="w-10 h-10 text-white" strokeWidth={4} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Payment Approved</h2>
                <Badge variant="blue" className="bg-blue-500/20 text-blue-300 border-none">Receipt #SUR-77291-B</Badge>
              </div>

              {/* Receipt Details */}
              <div className="p-10 space-y-8">
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-content-muted uppercase tracking-widest">Package</span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">Full Care Suite</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-content-muted uppercase tracking-widest">Date</span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">Apr 28, 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-content-muted uppercase tracking-widest">Method</span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">•••• 4242</span>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">$499.00</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <Button variant="ghost" className="bg-slate-50 border-slate-100 py-4">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </Button>
                  <Button variant="ghost" className="bg-emerald-50 text-emerald-600 border-emerald-100 py-4">
                    <Share2 className="w-5 h-5" />
                    WhatsApp Receipt
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <button 
                  onClick={() => setView('dashboard')}
                  className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-white px-6 py-2 rounded-full transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </Card>
            
            <p className="mt-10 text-content-muted text-[10px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
              Care package is now activated.<br/>
              Ready for superior recovery.
            </p>
          </motion.div>
        )}

        {view === 'notifSettings' && (
          <motion.div
            key="notifSettings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header title="Notifications" onBack={() => setView('dashboard')} />
            <Container className="space-y-8 pt-8">
              <div className="space-y-4">
                <SectionTitle title="System Alerts" />
                <Card className="p-0 overflow-hidden">
                  {[
                    { key: 'push', label: 'Push Notifications', desc: 'Real-time updates on your phone' },
                    { key: 'sms', label: 'SMS Messages', desc: 'Critical alerts via text' },
                    { key: 'email', label: 'Email Reports', desc: 'Weekly health summaries' }
                  ].map((item) => (
                    <div key={item.key} className="p-8 flex items-center justify-between border-b border-slate-50 last:border-none">
                      <div className="pr-4">
                        <p className="font-black text-slate-900 tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setSettingsToggles(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof settingsToggles] }))}
                        className={`w-14 h-8 rounded-full transition-all relative ${settingsToggles[item.key as keyof typeof settingsToggles] ? 'bg-primary' : 'bg-slate-200'}`}
                      >
                        <motion.div 
                          animate={{ x: settingsToggles[item.key as keyof typeof settingsToggles] ? 24 : 4 }}
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  ))}
                </Card>
              </div>

              <div className="space-y-4">
                <SectionTitle title="Marketing" />
                <Card className="p-8 flex items-center justify-between">
                   <div>
                    <p className="font-black text-slate-900 tracking-tight">Promotional Updates</p>
                    <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">New features and care packages</p>
                  </div>
                  <button 
                    onClick={() => setSettingsToggles(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`w-14 h-8 rounded-full transition-all relative ${settingsToggles.marketing ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: settingsToggles.marketing ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </Card>
              </div>
            </Container>
          </motion.div>
        )}

        {view === 'securitySettings' && (
          <motion.div
            key="securitySettings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header title="Security" onBack={() => setView('dashboard')} />
            <Container className="space-y-8 pt-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-4xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Safe & Secure</h3>
                <p className="text-content-secondary font-medium mt-2">Manage your data protection</p>
              </div>

              <div className="space-y-6">
                <Card className="p-0 overflow-hidden">
                  <div className="p-8 flex items-center justify-between border-b border-slate-50">
                    <div>
                      <p className="font-black text-slate-900 tracking-tight">Biometric Login</p>
                      <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">Face ID or Touch ID</p>
                    </div>
                    <button 
                      onClick={() => setSettingsToggles(prev => ({ ...prev, biometric: !prev.biometric }))}
                      className={`w-14 h-8 rounded-full transition-all relative ${settingsToggles.biometric ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                      <motion.div 
                        animate={{ x: settingsToggles.biometric ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                  <button 
                    onClick={() => setView('passwordChange')}
                    className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-black text-slate-900 tracking-tight">Change Password</p>
                      <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">Update your account password</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                </Card>

                <Card className="p-0 overflow-hidden">
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tight">Sign Out</p>
                        <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-0.5">End current session</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                </Card>

                <Card className="p-8 border-red-50">
                  <h4 className="font-black text-red-500 uppercase text-[10px] tracking-widest mb-4">Privacy Actions</h4>
                  <div className="space-y-4">
                    <Button variant="ghost" className="bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all py-4">
                      Clear Cache & Data
                    </Button>
                    <Button variant="ghost" className="text-content-muted text-[10px] font-black uppercase tracking-widest">
                      Request My Data Record
                    </Button>
                  </div>
                </Card>
              </div>
            </Container>
          </motion.div>
        )}

        {view === 'passwordChange' && (
          <motion.div
            key="passwordChange"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header title="Change Password" onBack={() => setView('securitySettings')} />
            <Container className="space-y-8 pt-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <Key className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Update Authentication</h3>
                <p className="text-content-secondary font-medium mt-1">Keep your account secure</p>
              </div>

              <Card className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-content-muted leading-none">New Password</label>
                  <input 
                    type="password"
                    placeholder="Enter new password"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold focus:border-primary focus:ring-0 transition-all outline-none"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-content-muted leading-none">Confirm New Password</label>
                  <input 
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold focus:border-primary focus:ring-0 transition-all outline-none"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>

                {passwordError && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 p-4 rounded-xl text-center">
                    {passwordError}
                  </p>
                )}

                <Button 
                  onClick={async () => {
                    if (!passwordForm.new || passwordForm.new !== passwordForm.confirm) {
                      setPasswordError('Passwords do not match');
                      return;
                    }
                    if (passwordForm.new.length < 6) {
                      setPasswordError('Password must be at least 6 characters');
                      return;
                    }
                    
                    setPasswordError('');
                    const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
                    
                    if (error) {
                      setPasswordError(error.message);
                    } else {
                      alert('Password updated successfully');
                      setView('securitySettings');
                      setPasswordForm({ current: '', new: '', confirm: '' });
                    }
                  }}
                  icon={ArrowRight}
                >
                  Update Password
                </Button>
              </Card>

              <div className="bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-xs text-content-muted font-medium leading-relaxed">
                    Once changed, you will be signed out from other active sessions for security purposes.
                  </p>
                </div>
              </div>
            </Container>
          </motion.div>
        )}

        {view === 'billingHistory' && (
          <motion.div
            key="billingHistory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header title="Billing" onBack={() => setView('dashboard')} />
            <Container className="space-y-6 pt-8 pb-32">
              <div className="flex bg-white p-1 rounded-3xl border border-slate-100 shadow-sm">
                {(['all', 'paid', 'pending'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBillingFilter(f)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${billingFilter === f ? 'bg-primary text-white shadow-primary/20 shadow-lg' : 'text-content-muted hover:bg-slate-50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <SectionTitle title="Transactions" />
                {billingLoading && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
              </div>

              <div className="space-y-4">
                {billingData
                  .filter(b => billingFilter === 'all' || b.status.toLowerCase() === billingFilter.toLowerCase())
                  .map((bill) => (
                    <Card key={bill.id} className="p-8 group hover:border-primary transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{bill.amount}</p>
                          <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-2">{bill.plan}</p>
                        </div>
                        <Badge variant={bill.status === 'Paid' ? 'emerald' : 'amber'}>{bill.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-content-muted font-black uppercase tracking-widest leading-none mb-1">Receipt ID</p>
                          <p className="text-xs font-bold text-slate-900">{bill.id}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">{bill.date}</p>
                        </div>
                        {bill.status === 'Paid' && (
                          <button 
                            onClick={() => alert(`Downloading receipt ${bill.id}...`)}
                            className="p-4 bg-blue-50 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </Card>
                  ))}
                
                {billingData.filter(b => billingFilter === 'all' || b.status.toLowerCase() === billingFilter.toLowerCase()).length === 0 && !billingLoading && (
                  <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No transactions found</p>
                  </div>
                )}
              </div>
            </Container>
          </motion.div>
        )}

        {view === 'helpSupport' && (
          <motion.div
            key="helpSupport"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header title="Help & Support" onBack={() => setView('settings')} />
            <div className="flex-1 overflow-y-auto pb-32">
              <Container className="pt-8 space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-50">
                    <MessageCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">How can we help?</h3>
                  <p className="text-content-secondary font-medium mt-2">Our team typically responds in under 1 hour</p>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Frequently Asked Questions" />
                  <div className="space-y-3">
                    {[
                      { q: "How do I book a consultation?", a: "Go to the Dashboard, select a doctor, and click 'Book Appointment'." },
                      { q: "Are the video calls encrypted?", a: "Yes, all medical consultations use end-to-end industry standard encryption." },
                      { q: "How can I download my reports?", a: "Navigate to 'Cases', select your case, and tap the download icon on any report." },
                      { q: "What should I do in an emergency?", a: "If you are experiencing a medical emergency, please call your local emergency services immediately." }
                    ].map((faq, i) => (
                      <Card key={i} className="p-0 overflow-hidden">
                        <button 
                          onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                          className="w-full p-6 flex items-center justify-between text-left"
                        >
                          <p className="text-sm font-bold text-slate-900 pr-4">{faq.q}</p>
                          <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeFaq === i && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-6 pb-6"
                            >
                              <p className="text-sm text-content-secondary leading-relaxed font-medium">
                                {faq.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Direct Support" />
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-6 flex flex-col items-center text-center gap-4 hover:border-primary transition-all group">
                      <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Live Chat</span>
                    </Card>
                    <Card className="p-6 flex flex-col items-center text-center gap-4 hover:border-primary transition-all group">
                      <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Phone className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Call Now</span>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Open a Ticket" />
                  <Card className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-content-muted">Issue description</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:border-primary focus:ring-0 outline-none min-h-[120px] resize-none"
                        placeholder="Tell us what's happening..."
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        if (supportMessage.trim()) {
                          alert('Ticket submitted successfully! Ref: #' + Math.floor(Math.random() * 10000));
                          setSupportMessage('');
                        }
                      }}
                      icon={Send}
                    >
                      Submit Ticket
                    </Button>
                  </Card>
                </div>

                <div className="space-y-4">
                  <SectionTitle title="Ticket History" />
                  <div className="space-y-3">
                    {supportTickets.map(ticket => (
                      <Card key={ticket.id} className="p-6 flex items-center justify-between hover:border-primary transition-all">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-black text-slate-900">{ticket.subject}</p>
                            <Badge variant={ticket.status === 'Open' ? 'amber' : 'emerald'}>{ticket.status}</Badge>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.id} • {ticket.date}</p>
                        </div>
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors">
                          <MessageSquare className="w-5 h-5" />
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>
              </Container>
            </div>
          </motion.div>
        )}

        {view === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto pb-64 no-scrollbar"
          >
            <Header title="Care Packages" onBack={() => setView('dashboard')} />

            <Container className="space-y-12 pb-12">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Superior Support</h2>
                <p className="text-content-secondary font-medium tracking-tight">Choose the best care path for your recovery.</p>
              </div>

              {/* Package Cards */}
              <div className="space-y-8">
                {[
                  { 
                    id: 'basic', 
                    name: 'Essential Care', 
                    price: '$199', 
                    features: ['Initial Assessment', 'AI Chat Assistant', 'Pre-op Materials'],
                    popular: false
                  },
                  { 
                    id: 'premium', 
                    name: 'Elite Recovery', 
                    price: '$499', 
                    features: ['Unlimited AI Access', 'Doctor Consultations', 'Recovery Roadmap', 'Priority Support'],
                    popular: true
                  },
                  { 
                    id: 'vip', 
                    name: 'VIP Concierge', 
                    price: '$999', 
                    features: ['Dedicated Care Lead', '24/7 Priority Channel', 'Home Support', 'VIP Lounge Access'],
                    popular: false
                  }
                ].map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                  >
                    <Card className={`p-10 relative group transition-all duration-500 ${
                      plan.popular 
                      ? 'border-primary ring-4 ring-primary/5 bg-white shadow-strong scale-105 z-10' 
                      : 'hover:border-slate-300'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                          <Badge variant="blue" className="px-6 py-2 shadow-primary">Member's Choice</Badge>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{plan.name}</h4>
                          <p className="text-[10px] text-content-muted font-black uppercase tracking-[0.2em]">Full Activation</p>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                        </div>
                      </div>

                      <ul className="space-y-5 mb-10">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-4 text-content-secondary font-medium tracking-tight text-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={4} />
                            </div>
                            {feat}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        variant={plan.popular ? 'primary' : 'secondary'} 
                        className="py-5 shadow-soft"
                      >
                        Select Plan
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 pb-12">
                <Card className="p-6 flex items-center gap-4 bg-slate-50 border-none">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-soft">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Encrypted</p>
                    <p className="text-[9px] text-content-muted font-black uppercase tracking-widest">SSL Security</p>
                  </div>
                </Card>
                <Card className="p-6 flex items-center gap-4 bg-slate-50 border-none">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-soft">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Instant</p>
                    <p className="text-[9px] text-content-muted font-black uppercase tracking-widest">Plan Access</p>
                  </div>
                </Card>
              </div>
            </Container>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 inset-x-0 p-8 pb-12 bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-40 shadow-strong flex flex-col gap-6">
              <div className="flex justify-center gap-6 text-[10px] font-black text-content-muted uppercase tracking-[0.3em]">
                <span>Visa</span><span>Amex</span><span>Apple Pay</span>
              </div>
              <Button
                variant="primary"
                onClick={() => setView('receipt')}
                className="py-6 shadow-primary group"
              >
                Complete Payment
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'booking' && (
          <motion.div
            key="booking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto pb-40 no-scrollbar"
          >
            <Header title="Schedule" onBack={() => setView('dashboard')} />

            <Container className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Book Appointment</h2>
                <p className="text-content-secondary font-medium tracking-tight">Select your preferred slot for consultation.</p>
              </div>

              {/* Date Selector */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <SectionTitle title="Select Date" />
                  <Badge variant="blue">May 2024</Badge>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
                  {[...Array(14)].map((_, i) => {
                    const day = i + 10;
                    const date = new Date(2024, 4, day);
                    const isSelected = selectedDate === day;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`flex flex-col items-center gap-2 min-w-[72px] py-6 rounded-3xl transition-all border-4 shadow-soft ${
                          isSelected 
                          ? 'bg-primary border-primary text-white shadow-primary scale-110 z-10' 
                          : 'bg-white border-transparent text-slate-400 hover:border-slate-50'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-xl font-black tracking-tighter">{day}</span>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Time Selection */}
              <section>
                 <SectionTitle title="Preferred Time" />
                 <div className="grid grid-cols-3 gap-4 mt-6">
                    {['09:00', '10:00', '11:20', '14:00', '15:30', '17:00'].map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-5 rounded-2xl font-black text-sm tracking-tight transition-all border-4 ${
                          selectedTime === time
                          ? 'bg-slate-900 border-slate-900 text-white shadow-strong'
                          : 'bg-white border-slate-50 text-slate-400 hover:border-slate-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                 </div>
              </section>

              {/* Consultation Type */}
              <section className="pb-12">
                <SectionTitle title="Session Type" />
                <div className="space-y-4 mt-6">
                   {['Initial Assessment', 'Follow-up Call', 'Pre-surgery Evaluation'].map((type) => (
                     <Card 
                        key={type}
                        className={`p-6 flex items-center justify-between group cursor-pointer transition-all ${
                          type === 'Initial Assessment' ? 'border-primary ring-2 ring-primary/5' : ''
                        }`}
                     >
                       <span className={`font-black tracking-tight ${type === 'Initial Assessment' ? 'text-slate-900' : 'text-content-secondary'}`}>{type}</span>
                       <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                          type === 'Initial Assessment' ? 'border-primary' : 'border-slate-50 group-hover:border-slate-100'
                       }`}>
                          {type === 'Initial Assessment' && <div className="w-3 h-3 bg-primary rounded-full" />}
                       </div>
                     </Card>
                   ))}
                </div>
              </section>
            </Container>

            {/* Confirm Banner */}
            <div className="fixed bottom-0 inset-x-0 p-8 pb-12 bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-40 shadow-strong">
              <Button
                variant="primary"
                onClick={() => setView('dashboard')}
                disabled={!selectedTime}
                className="py-6 shadow-primary group"
              >
                <span>Confirm Appointment</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'uploadReport' && (
          <motion.div
            key="uploadReport"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto no-scrollbar"
          >
            <Header title="Records" onBack={() => setView('dashboard')} />

            <Container className="space-y-12 pb-40">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Digital Vault</h2>
                <p className="text-content-secondary font-medium tracking-tight">Upload medical scans for instant AI analysis.</p>
              </div>

              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={simulateUpload}
              >
                <Card className="border-4 border-dashed border-slate-200 p-16 flex flex-col items-center justify-center gap-8 cursor-pointer transition-all hover:border-primary group bg-slate-50/50 overflow-hidden relative">
                  {isUploading && (
                    <motion.div 
                      key="progress"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="absolute bottom-0 left-0 h-2 bg-primary z-10"
                    />
                  )}
                  <div className={`w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-strong transition-all duration-700 ${isUploading ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                    <Upload className={`w-10 h-10 ${isUploading ? 'text-primary animate-pulse' : 'text-primary'}`} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">
                      {isUploading ? `Uploading ${uploadProgress}%` : "Import Records"}
                    </p>
                    <p className="text-[10px] text-content-muted font-black uppercase tracking-widest">Supports PDF, JPG, DICOM</p>
                  </div>
                </Card>
              </motion.div>

              {/* File List */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <SectionTitle title="Vault Contents" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{uploadedFiles.length} Total</span>
                </div>
                <AnimatePresence mode="popLayout">
                  {uploadedFiles.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-20 border-4 border-slate-50 border-dashed rounded-[3rem] flex flex-col items-center gap-4 text-slate-200"
                    >
                      <File className="w-12 h-12 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No records uploaded</span>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {uploadedFiles.map((file, i) => (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Card className="p-6 flex items-center gap-6 group hover:border-primary transition-all">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft ${file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              <FileText className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-slate-900 tracking-tight leading-tight">{file.name}</p>
                              <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">{file.size} • READY</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setUploadedFiles(prev => prev.filter((_, idx) => idx !== i));
                              }}
                              className="p-3 text-slate-200 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                            >
                              <Plus className="w-6 h-6 rotate-45" />
                            </button>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Container>

            {/* Submit CTA */}
            {uploadedFiles.length > 0 && (
              <div className="fixed bottom-0 inset-x-0 p-8 pb-12 bg-white/90 backdrop-blur-2xl border-t border-slate-100 z-40 shadow-strong">
                <Button
                  variant="primary"
                  onClick={() => setView('dashboard')}
                  className="py-6 shadow-primary shadow-2xl"
                >
                  Verify Documents
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {view === 'videoCall' && (
          <motion.div
            key="videoCall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-slate-950 relative h-screen overflow-hidden"
          >
            {/* Main Video (Doctor) */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop" 
                alt="Doctor View" 
                className={`w-full h-full object-cover scale-110 transition-all duration-700 ${isCameraOff ? 'blur-3xl opacity-40' : 'opacity-80'}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 p-8 flex justify-between items-center bg-transparent backdrop-blur-none">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setView('dashboard')}
                  className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
                <div>
                   <h3 className="text-xl font-black text-white tracking-tight leading-none">Consultation</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live • 12:45</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Self View Card */}
            <motion.div 
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              className="absolute bottom-40 right-8 w-44 h-64 bg-slate-800 rounded-4xl overflow-hidden border-4 border-white/20 shadow-primary z-20"
            >
               <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=300&fit=crop" 
                alt="My View" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* UI Overlay Controls */}
            <div className="absolute bottom-12 inset-x-0 px-8 z-30">
               <Card className="bg-slate-900/60 backdrop-blur-3xl border-white/10 p-6 flex items-center justify-around rounded-[3rem]">
                  {[
                    { icon: isMuted ? MicOff : Mic, color: isMuted ? 'text-red-400' : 'text-white', action: () => setIsMuted(!isMuted) },
                    { icon: isCameraOff ? VideoOff : Camera, color: isCameraOff ? 'text-red-400' : 'text-white', action: () => setIsCameraOff(!isCameraOff) },
                    { icon: MessageSquare, color: 'text-white', action: () => setView('chat') },
                    { icon: PhoneOff, color: 'text-white', bg: 'bg-red-500', shadow: 'shadow-red-500/40', action: () => setView('dashboard') }
                  ].map((ctrl, i) => (
                    <button 
                      key={i}
                      onClick={ctrl.action}
                      className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all active:scale-90 ${ctrl.bg || 'bg-white/10 hover:bg-white/20'} ${ctrl.shadow || ''}`}
                    >
                      <ctrl.icon className={`w-7 h-7 ${ctrl.color}`} />
                    </button>
                  ))}
               </Card>
            </div>
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col bg-surface-bg h-screen"
          >
            <Header 
              title="Nuplasm AI" 
              onBack={() => setView('dashboard')}
              rightElement={
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] uppercase tracking-widest font-black text-emerald-600 leading-none">Specialist Online</span>
                </div>
              }
            />

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 flex flex-col no-scrollbar">
              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`max-w-[85%] p-6 rounded-4xl shadow-soft relative group ${
                    msg.role === 'ai' 
                    ? 'bg-white text-slate-800 self-start rounded-tl-none border-2 border-slate-50' 
                    : 'bg-slate-900 text-white self-end rounded-tr-none shadow-strong'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed mb-2">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1.5 ${msg.role === 'ai' ? 'text-content-muted' : 'text-slate-400'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{msg.time}</span>
                    {msg.role === 'user' && <CheckCheck className="w-3.5 h-3.5 text-primary" strokeWidth={3} />}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-4xl rounded-tl-none border-2 border-slate-50 self-start flex gap-1.5 items-center shadow-soft"
                >
                  <span className="w-2 h-2 bg-primary/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies & Input */}
            <div className="p-8 bg-white border-t border-slate-50 space-y-6 pb-12 shadow-strong">
              {/* Quick Replies */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                {["Pain levels?", "Next Visit?", "Upload Meds", "Expert Help"].map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="whitespace-nowrap px-6 py-3 bg-slate-50 text-slate-600 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shrink-0 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Text Input Control */}
              <div className="flex items-center gap-4">
                <button 
                  className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all active:scale-90 shadow-soft"
                  id="chat-attach"
                >
                  <Paperclip className="w-6 h-6" />
                </button>
                
                <div className="flex-1 flex items-center bg-slate-50 border-4 border-slate-50 focus-within:border-primary/10 focus-within:bg-white rounded-3xl px-6 py-1 transition-all shadow-inner relative h-16">
                   <input 
                      type="text" 
                      placeholder="Type your question..."
                      className="flex-1 bg-transparent border-none outline-none p-3 text-sm font-bold text-slate-900 placeholder:text-content-muted"
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
                  className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center shadow-primary disabled:opacity-30 disabled:bg-slate-200 disabled:shadow-none transition-all group"
                  id="send-chat"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto no-scrollbar scroll-smooth"
          >
            {/* Header Area with Immersive Image */}
            <div className="h-[45vh] relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1200&fit=crop" 
                alt="Dr. Sarah Mitchell" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <button 
                onClick={() => setView('dashboard')}
                className="absolute top-12 left-8 p-4 bg-white/10 backdrop-blur-3xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>

              <div className="absolute bottom-12 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="blue" className="bg-primary/20 backdrop-blur-xl border-primary/30 text-white">Top Specialist</Badge>
                  <div className="flex items-center gap-1.5 text-amber-400 drop-shadow-md">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-sm font-black tracking-tight">4.9 (1.2k Reviews)</span>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-2">Dr. Sarah Mitchell</h2>
                <p className="text-white/70 font-black uppercase text-[10px] tracking-[0.2em]">Orthopedic & Sports Surgeon</p>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 -mt-10 rounded-t-[3.5rem] bg-surface-bg relative z-10 pt-10">
              <Container className="space-y-12 pb-48">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Experience', val: '12 yr', icon: Clock, color: 'text-primary' },
                    { label: 'Patients', val: '4.5k+', icon: User, color: 'text-emerald-500' },
                    { label: 'Cleared', val: '98%', icon: ShieldCheck, color: 'text-amber-500' },
                  ].map((stat, i) => (
                    <Card key={i} className="flex flex-col items-center gap-2 p-5 text-center">
                      <div className={`p-2.5 rounded-2xl bg-slate-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-lg font-black text-slate-900 tracking-tight leading-none">{stat.val}</span>
                      <span className="text-[9px] uppercase font-black text-content-muted tracking-widest">{stat.label}</span>
                    </Card>
                  ))}
                </div>

                {/* Bio Section */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SectionTitle title="About the Specialist" />
                  <Card className="p-8">
                    <p className="text-content-secondary font-medium leading-relaxed">
                      Dr. Sarah Mitchell is a globally recognized board-certified orthopedic surgeon specializing in minimally invasive knee and shoulder reconstructions. With over 12 years of experience at St. Jude Medical Center, she pioneered the accelerated recovery protocol for athletes.
                    </p>
                  </Card>
                </motion.section>

                {/* Specializations Tags */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SectionTitle title="Specializations" />
                  <div className="flex flex-wrap gap-2.5">
                    {['ACL Reconstruction', 'Joint Replacement', 'Sports Medicine', 'Cartilage Repair', 'Arthroscopy'].map((tag) => (
                      <Badge key={tag} className="px-6 py-3 rounded-2xl bg-white border-2 border-slate-50 text-slate-600 font-bold text-xs shadow-soft leading-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.section>

                {/* Education / Credentials */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SectionTitle title="Education" />
                  <div className="space-y-4">
                    {[
                      { school: 'Harvard Medical School', degree: 'Doctor of Medicine (M.D.)', years: '2008-2012' },
                      { school: 'Johns Hopkins University', degree: 'Surgical Residency', years: '2012-2016' }
                    ].map((edu, i) => (
                      <Card key={i} className="p-6 flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center flex-shrink-0 border-2 border-slate-100">
                          <Stethoscope className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 text-lg tracking-tight leading-tight mb-1">{edu.school}</h5>
                          <p className="text-[10px] text-content-muted font-black uppercase tracking-widest">{edu.degree} • {edu.years}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.section>
              </Container>
            </div>

            {/* Sticky Action Footer */}
            <FloatingBanner>
               <Button 
                onClick={() => setView('chat')}
                icon={ChevronRight}
              >
                <span>Consult with Specialist</span>
              </Button>
            </FloatingBanner>
          </motion.div>
        )}

        {view === 'caseDetail' && (
          <motion.div
            key="caseDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col bg-surface-bg overflow-y-auto no-scrollbar"
          >
            <Header 
              title="Case Status" 
              onBack={() => setView('dashboard')}
              rightElement={
                <button className="p-3 rounded-2xl hover:bg-slate-50 transition-all">
                  <MoreHorizontal className="w-6 h-6 text-content-muted" />
                </button>
              }
            />

            <Container className="space-y-12 pb-40">
              {/* Case Summary Card */}
              {selectedCase && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1.5">
                        <Badge variant="blue">{selectedCase.type}</Badge>
                        <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{selectedCase.title}</h2>
                      </div>
                      <Badge variant={
                        selectedCase.status === 'In Progress' ? 'blue' :
                        selectedCase.status === 'Assigned' ? 'emerald' :
                        'amber'
                      }>
                        {selectedCase.status}
                      </Badge>
                    </div>
                    <p className="text-content-secondary font-medium leading-relaxed pb-8 border-b border-slate-50">
                      {selectedCase.description}
                    </p>
                    <div className="pt-8 flex justify-between items-center text-[10px] text-content-muted font-black uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        <span>ID: #SRG-{selectedCase.id}</span>
                      </div>
                      <span>{selectedCase.date}</span>
                    </div>
                  </Card>
                </motion.section>
              )}

              {/* Assigned Doctor Section */}
              {selectedCase && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <SectionTitle title="Medical Team" />
                  <Card onClick={() => setView('doctorProfile')} className="mt-6 bg-slate-900 border-none p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-strong">
                        <img 
                          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" 
                          alt={selectedCase.doctor} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-white tracking-tight">{selectedCase.doctor}</h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Surgical Specialist</p>
                        <div className="mt-3">
                          <Badge variant="blue" className="bg-blue-500/20 text-blue-300 border-none">Verified Expert</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.section>
              )}

              {/* Timeline Status */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SectionTitle title="Care Journey" />
                <Card className="mt-6 p-10 relative">
                  {[
                    { label: 'Initial Assessment', state: 'completed', date: 'Mar 12' },
                    { label: 'Surgical Consultation', state: 'completed', date: 'Mar 15' },
                    { label: 'Pre-surgery Evaluation', state: 'active', date: 'In Progress' },
                    { label: 'Surgical Day', state: 'upcoming', date: 'TBD' },
                    { label: 'Post-Op Recovery', state: 'upcoming', date: 'TBD' }
                  ].map((step, idx, arr) => (
                    <div key={idx} className="flex gap-8 relative">
                      {idx !== arr.length - 1 && (
                        <div className={`absolute left-[13px] top-[30px] w-[2px] h-[calc(100%-10px)] ${step.state === 'completed' ? 'bg-primary' : 'bg-slate-100'}`} />
                      )}
                      
                      <div className="relative z-10 pt-1.5 slice-center">
                        <div className={`w-7 h-7 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-strong ${
                          step.state === 'completed' ? 'bg-primary border-primary' : 
                          step.state === 'active' ? 'bg-white border-primary border-2 animate-pulse' : 
                          'bg-white border-slate-100 border-2'
                        }`}>
                          {step.state === 'completed' && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                        </div>
                      </div>

                      <div className="flex-1 pb-10">
                        <h5 className={`text-base font-black tracking-tight ${step.state === 'upcoming' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</h5>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${step.state === 'active' ? 'text-primary' : 'text-content-muted'}`}>{step.date}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </motion.section>

              {/* Reports Section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <SectionTitle title="Records" />
                  <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-full transition-all">View All</button>
                </div>
                <div className="space-y-4">
                  {['MRI Scan Report', 'Blood Panel Results'].map((report, i) => (
                    <Card key={i} className="p-6 flex items-center gap-6 group hover:border-primary transition-all">
                      <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-black text-slate-900 tracking-tight">{report}</h5>
                        <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">PDF • 2.4 MB • MAR 14</p>
                      </div>
                      <button className="p-3 text-slate-200 group-hover:text-primary transition-colors hover:bg-blue-50 rounded-xl">
                        <ArrowRight className="w-5 h-5 -rotate-45" />
                      </button>
                    </Card>
                  ))}
                </div>
              </motion.section>
            </Container>

            {/* Bottom Actions Bar */}
            <div className="fixed bottom-0 inset-x-0 p-8 pb-12 bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex gap-4 z-40 shadow-strong">
                <Button 
                   variant="secondary"
                   onClick={() => setView('chat')}
                   className="flex-1 py-5 bg-slate-900 text-white hover:bg-slate-800"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat Assistant
                </Button>
                <button 
                   onClick={() => setView('videoCall')}
                   className="flex-[0.3] bg-primary text-white h-16 rounded-3xl flex items-center justify-center shadow-primary group transition-all active:scale-95"
                >
                   <Video className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </button>
            </div>
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col relative bg-surface-bg h-screen"
          >
            {/* Nav Header */}
            <div className="p-8 pb-6 sticky top-0 bg-white/80 backdrop-blur-xl z-20 flex justify-between items-center border-b border-slate-100 shadow-soft">
              <div>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-black text-content-muted uppercase tracking-[0.2em] mb-1.5"
                >
                  Good morning,
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-black text-slate-900 tracking-tight"
                >
                  Krishna
                </motion.h2>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('notifications')}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-white hover:shadow-soft"
              >
                <Bell className="w-6 h-6 text-content-muted group-hover:text-primary transition-colors" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full shadow-lg shadow-red-200"></span>
                )}
              </motion.button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
              <Container>
                {activeTab === 'home' && (
                  <div className="space-y-12">
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
                      <Card className="bg-slate-900 border-none overflow-hidden group-active:scale-[0.98] transition-all p-10 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl transition-colors"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-10">
                            <Badge variant="blue">Active Case</Badge>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Started Mar 12</span>
                          </div>
                          <h3 className="text-3xl font-black text-white mb-3 tracking-tight leading-tight">ACL Reconstruction</h3>
                          <p className="text-slate-400 font-medium mb-10">Pre-Surgery Assessment</p>
                          
                          {/* Progress Indicator */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-end">
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Phase 2 of 5</p>
                              <p className="text-sm font-black text-white">40% Completed</p>
                            </div>
                            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "40%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.section>

                    <div className="space-y-6">
                      <SectionTitle title="Care Specialist" />
                      <Card onClick={() => setView('doctorProfile')} className="p-8">
                        <div className="flex items-center gap-6 mb-8">
                          <div className="w-16 h-16 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-50 shadow-soft">
                            <img 
                              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop" 
                              alt="Dr. Sarah Mitchell" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Dr. Sarah Mitchell</h4>
                            <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-1">Orthopedic Surgeon</p>
                            <div className="mt-2">
                              <Badge variant="emerald">Certified Specialist</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button variant="ghost" className="flex-1 py-4 border-slate-100" onClick={(e) => { e.stopPropagation(); }}>
                            <Calendar className="w-4 h-4" />
                            Schedule
                          </Button>
                          <Button 
                            variant="primary"
                            className="flex-1 py-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(mockCases[0]);
                              setView('chat');
                            }}
                          >
                             <MessageSquare className="w-4 h-4" />
                             Chat now
                          </Button>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-6 pb-12">
                      <SectionTitle title="Quick Actions" />
                      <div className="grid grid-cols-2 gap-4">
                        <Card 
                          onClick={() => setView('booking')}
                          className="p-8 flex flex-col gap-6 text-left hover:border-primary transition-all group"
                        >
                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                          </div>
                          <span className="font-black text-slate-900 text-sm uppercase tracking-widest leading-relaxed">Book<br/>Specialist</span>
                        </Card>
                        <Card 
                          onClick={() => setView('uploadReport')}
                          className="p-8 flex flex-col gap-6 text-left hover:border-primary transition-all group"
                        >
                          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-teal-600" />
                          </div>
                          <span className="font-black text-slate-900 text-sm uppercase tracking-widest leading-relaxed">Upload<br/>Records</span>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === 'reports' && (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <SectionTitle title="Medical Applications" />
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                      {['all', 'Pending', 'Assigned', 'In Progress'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setCaseFilter(filter)}
                          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                            caseFilter === filter 
                            ? 'bg-primary border-primary text-white shadow-primary' 
                            : 'bg-white text-content-muted border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {filter}
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
                      >
                        <Card className="p-8 group hover:border-primary transition-all">
                          <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1.5">
                              <Badge variant="blue">{item.type}</Badge>
                              <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{item.title}</h4>
                            </div>
                            <Badge variant={
                              item.status === 'In Progress' ? 'blue' :
                              item.status === 'Assigned' ? 'emerald' :
                              'amber'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                <User className="w-4 h-4 text-content-muted" />
                              </div>
                              <span className="text-[10px] font-black text-content-secondary uppercase tracking-widest">{item.doctor}</span>
                            </div>
                            <span className="text-[10px] font-black text-content-muted uppercase tracking-widest">{item.date}</span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {mockCases.filter(c => caseFilter === 'all' || c.status === caseFilter).length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-white rounded-5xl shadow-soft flex items-center justify-center text-slate-200 border border-slate-50">
                        <FileText className="w-10 h-10" />
                      </div>
                      <p className="text-xs font-black text-content-muted uppercase tracking-[0.2em]">No applications found</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="py-32 text-center flex flex-col items-center gap-8">
                  <div className="w-32 h-32 bg-white rounded-5xl shadow-strong flex items-center justify-center text-primary relative">
                    <div className="absolute inset-0 rounded-5xl border-2 border-primary/20 animate-ping opacity-20" />
                    <Calendar className="w-14 h-14" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Care Journey</h3>
                    <p className="text-content-secondary max-w-xs mx-auto font-medium leading-relaxed">
                      Your upcoming milestones and therapy sessions will appear here once your plan is activated.
                    </p>
                  </div>
                  <Button variant="secondary" className="w-auto px-10 py-4 shadow-soft" onClick={() => setView('booking')}>
                    Explore Slots
                  </Button>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-12 pb-12">
                  {/* User Profile Card */}
                  <Card className="p-10 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                    <div className="w-28 h-28 bg-slate-50 rounded-4xl flex items-center justify-center text-content-muted mb-6 border-4 border-white shadow-strong relative group">
                      <User className="w-12 h-12 group-hover:scale-110 transition-transform" />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-white shadow-primary">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Krishna Dhall</h3>
                    <p className="text-content-muted text-[10px] font-black uppercase tracking-[0.2em] mb-8">Patient ID: #PAT-2024-X</p>
                    
                    <div className="grid grid-cols-3 gap-4 w-full py-8 border-y border-slate-50 mb-8">
                      <div>
                        <p className="text-[10px] font-black text-content-muted uppercase tracking-widest mb-1">Age</p>
                        <p className="font-extrabold text-slate-900">28</p>
                      </div>
                      <div className="border-x border-slate-50">
                        <p className="text-[10px] font-black text-content-muted uppercase tracking-widest mb-1">Weight</p>
                        <p className="font-extrabold text-slate-900">72kg</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-content-muted uppercase tracking-widest mb-1">Blood</p>
                        <p className="font-extrabold text-red-500">O+</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <Button 
                        variant="primary"
                        onClick={() => setView('payment')}
                        className="py-5 bg-slate-900 hover:bg-slate-800 border-none"
                      >
                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                        Upgrade to Premium
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => setView('doctorDashboard')}
                        className="py-5 bg-blue-50 text-primary hover:bg-blue-100"
                      >
                        <Stethoscope className="w-5 h-5" />
                        Doctor Portal Access
                      </Button>
                    </div>
                  </Card>

                  {/* Medical History Section */}
                  <div className="space-y-6">
                    <SectionTitle title="Vital Information" />
                    <div className="space-y-3">
                      {[
                        { icon: Heart, label: 'Allergies', value: 'Peanuts, Penicillin', color: 'text-red-500', bg: 'bg-red-50' },
                        { icon: Stethoscope, label: 'Medications', value: 'Ibuprofen (PRN)', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: Info, label: 'History', value: 'Appendectomy (2018)', color: 'text-amber-500', bg: 'bg-amber-50' }
                      ].map((item, i) => (
                        <Card key={i} className="p-6 flex items-center gap-6 group hover:border-primary/20 transition-all">
                          <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-content-muted uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-base font-black text-slate-900 tracking-tight">{item.value}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Settings Menu */}
                  <div className="space-y-6">
                    <SectionTitle title="Account Settings" />
                    <Card className="overflow-hidden p-0">
                      {[
                        { icon: Bell, label: 'Notifications', desc: 'Push, Email, SMS', action: () => setView('notifSettings') },
                        { icon: ShieldCheck, label: 'Security & Privacy', desc: 'Biometric, Password', action: () => setView('securitySettings') },
                        { icon: CreditCard, label: 'Billing History', desc: 'Manage payments', action: () => setView('billingHistory') },
                        { icon: MessageCircle, label: 'Help & Support', desc: 'Contact care team', action: () => setView('helpSupport') },
                        { icon: LogOut, label: 'Logout', desc: 'End current session', danger: true, action: () => setShowLogoutConfirm(true) }
                      ].map((item, i, arr) => (
                        <button 
                          key={i} 
                          onClick={item.action}
                          className={`w-full p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors text-left group ${i !== arr.length - 1 ? 'border-b border-slate-50' : ''}`}
                        >
                          <div className={`p-4 rounded-2xl ${item.danger ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-slate-50 text-content-muted'} transition-all`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-black text-base tracking-tight ${item.danger ? 'text-red-500' : 'text-slate-900'}`}>{item.label}</p>
                            <p className="text-[10px] text-content-muted font-black uppercase tracking-widest mt-0.5">{item.desc}</p>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${item.danger ? 'text-red-300' : 'text-slate-200'} group-hover:translate-x-1 transition-transform`} />
                        </button>
                      ))}
                    </Card>
                  </div>

                  <div className="text-center pt-8">
                     <p className="text-[10px] text-slate-200 font-black uppercase tracking-[0.4em]">Nuplasm AI v2.4.0</p>
                  </div>
                </div>
              )}
            </Container>
          </div>

          {/* Floating Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('newCase')}
            className="fixed bottom-32 right-8 w-20 h-20 bg-slate-900 text-white rounded-4xl shadow-strong flex items-center justify-center group z-30"
          >
            <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500 ease-out" />
          </motion.button>

          {/* Bottom Tab Bar */}
          <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-8 py-6 pb-10 flex justify-between items-center z-40 shadow-strong">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'calendar', icon: Calendar, label: 'Care' },
              { id: 'reports', icon: FileText, label: 'Docs' },
              { id: 'profile', icon: User, label: 'Menu' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex flex-col items-center gap-2 group relative min-w-[64px]"
                >
                  <div className={`p-3 rounded-2xl transition-all duration-500 ease-out ${isActive ? 'bg-primary text-white shadow-primary scale-110' : 'text-content-muted hover:bg-slate-50'}`}>
                    <tab.icon className="w-6 h-6 shrink-0" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : 'text-content-muted'}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div 
                       layoutId="tab-underline"
                       className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LogOut className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Sign Out?</h3>
                <p className="text-content-secondary font-medium mb-8">Are you sure you want to log out of your account?</p>
                
                <div className="space-y-3">
                  <Button 
                    className="bg-red-500 hover:bg-red-600 border-red-500 shadow-red-200 w-full"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setShowLogoutConfirm(false);
                      setView('splash');
                    }}
                  >
                    Yes, Sign Out
                  </Button>
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
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
