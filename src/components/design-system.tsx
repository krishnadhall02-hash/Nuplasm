import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

// --- PRIMITIVES ---

export const Container = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`p-8 space-y-8 ${className}`}>
    {children}
  </div>
);

export const Header = ({ 
  title, 
  onBack, 
  rightElement,
  sticky = true 
}: { 
  title: string, 
  onBack?: () => void, 
  rightElement?: ReactNode,
  sticky?: boolean
}) => (
  <div className={`${sticky ? 'sticky top-0 bg-white/80 backdrop-blur-md z-30' : ''} p-6 pt-10 flex items-center justify-between`}>
    {onBack ? (
      <button 
        onClick={onBack}
        className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <ArrowRight className="w-6 h-6 rotate-180 text-slate-800" />
      </button>
    ) : <div className="w-10" />}
    <h3 className="font-bold text-slate-900">{title}</h3>
    {rightElement || <div className="w-10" />}
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  disabled = false,
  icon: Icon
}: { 
  children: ReactNode, 
  onClick?: (e: any) => void, 
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success',
  className?: string,
  disabled?: boolean,
  icon?: any
}) => {
  const variants = {
    primary: "bg-slate-900 text-white shadow-strong hover:bg-slate-800",
    secondary: "bg-blue-600 text-white shadow-primary hover:bg-blue-700",
    ghost: "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100",
    success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-100",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-30 disabled:grayscale ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon className="w-5 h-5" />}
    </motion.button>
  );
};

export const Card = ({ 
  children, 
  className = "", 
  onClick,
  hoverable = true,
  ...props
}: { 
  children: ReactNode, 
  className?: string, 
  onClick?: () => void,
  hoverable?: boolean,
  [key: string]: any
}) => (
  <motion.div
    whileHover={hoverable && onClick ? { scale: 1.01, y: -2 } : {}}
    onClick={onClick}
    className={`bg-white p-6 rounded-4xl border border-slate-100 shadow-soft transition-all ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const Badge = ({ 
  children, 
  variant = 'blue',
  className = "",
  ...props
}: { 
  children: ReactNode, 
  variant?: 'blue' | 'red' | 'emerald' | 'amber' | 'purple' | 'slate',
  className?: string,
  [key: string]: any
}) => {
  const variants = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-50 text-slate-400',
  };

  return (
    <span 
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const SectionTitle = ({ 
  title, 
  action, 
  actionLabel 
}: { 
  title: string, 
  action?: () => void, 
  actionLabel?: string 
}) => (
  <div className="flex justify-between items-center mb-4 px-2">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
    {action && (
      <button onClick={action} className="text-blue-600 font-bold text-xs hover:underline">
        {actionLabel || 'View All'}
      </button>
    )}
  </div>
);

export const FloatingBanner = ({ children }: { children: ReactNode }) => (
  <div className="fixed bottom-0 inset-x-0 p-8 pt-4 pb-12 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40">
    {children}
  </div>
);
