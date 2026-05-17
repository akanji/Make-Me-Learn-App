import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CreditCard, Bell, Info, LogOut, ChevronRight, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { userData, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    logout();
    navigate('/');
  };

  const sections = [
    {
      title: 'Subscription',
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-2xl border border-brand-border">
            <div>
              <p className="text-xs text-muted-text font-black uppercase mb-1">Current Plan</p>
              <p className="font-display font-bold text-lg capitalize">{userData?.plan} Plan</p>
            </div>
            {userData?.plan === 'trial' && (
              <div className="text-right">
                <p className="text-[10px] text-primary font-black uppercase mb-1">Status</p>
                <div className="flex items-center gap-1 text-green-400 font-bold text-sm">
                  Active Trial
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlanCard 
              type="monthly" 
              price="$19.99" 
              description="Billed monthly" 
              accent="primary"
              preferred={userData?.plan === 'monthly'}
            />
            <PlanCard 
              type="yearly" 
              price="$199.99" 
              description="Save 17% annually" 
              accent="dark-brand" 
              badge="BEST VALUE"
              preferred={userData?.plan === 'yearly'}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-3">
          <Toggle label="Course Reminders" active />
          <Toggle label="Certificate Alerts" active />
          <Toggle label="Scout AI Updates" active />
        </div>
      )
    },
    {
      title: 'Platform Info',
      icon: Info,
      content: (
        <div className="bg-surface-elevated/50 rounded-2xl border border-brand-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <Row label="Version" value="v1.0.4-premium" />
              <Row label="AI Engine" value="Gemini 3.1 Pro" />
              <Row label="Provisioned By" value="A2A Agent" />
              <Row label="Last Sync" value="Just now" last />
            </tbody>
          </table>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-display font-black">Settings</h1>
        <p className="text-muted-text mt-1">Configure your experience and account preferences</p>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.title} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-elevated rounded-lg text-primary">
                <section.icon size={20} />
              </div>
              <h2 className="text-xl font-display font-bold">{section.title}</h2>
            </div>
            {section.content}
          </section>
        ))}

        <section className="pt-10 border-t border-brand-border">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-400 font-bold hover:text-red-300 transition-colors"
          >
            <LogOut size={20} /> Sign Out of Platform
          </button>
        </section>
      </div>
    </div>
  );
}

function PlanCard({ type, price, description, accent, badge, preferred }: any) {
  return (
    <div className={`p-6 rounded-3xl border-2 transition-all relative group h-full flex flex-col ${
      preferred ? 'bg-primary/10 border-primary' : 'bg-surface-card border-brand-border hover:border-primary/50'
    }`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-dark-brand text-white text-[10px] font-black px-4 py-1 rounded-full border border-white/10">
          {badge}
        </div>
      )}
      <h4 className="text-sm font-black uppercase tracking-widest text-muted-text mb-4 capitalize">{type} Plan</h4>
      <div className="flex items-baseline gap-1 mb-2">
        <p className="text-3xl font-display font-black">{price}</p>
        <p className="text-xs text-muted-text">/ {type === 'monthly' ? 'mo' : 'yr'}</p>
      </div>
      <p className="text-xs text-muted-text mb-8">{description}</p>
      
      <div className="mt-auto">
        <button 
          disabled 
          className={`w-full py-3 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed group-hover:opacity-80 transition-all ${
            accent === 'primary' ? 'bg-primary text-white' : 'bg-dark-brand text-white'
          }`}
        >
          Subscribe {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
        <p className="text-[10px] text-center text-muted-text mt-3 font-medium italic">Payment integration coming soon</p>
      </div>
    </div>
  );
}

function Toggle({ label, active }: { label: string; active?: boolean }) {
  const [isOn, setIsOn] = React.useState(active);
  return (
    <div className="flex items-center justify-between p-4 bg-surface-elevated/50 rounded-2xl border border-brand-border">
      <span className="text-sm font-bold text-off-white">{label}</span>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-12 h-6 rounded-full relative transition-colors ${isOn ? 'bg-primary' : 'bg-surface-base'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOn ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

function Row({ label, value, last }: { label: string, value: string, last?: boolean }) {
  return (
    <tr className={!last ? 'border-b border-brand-border/50' : ''}>
      <td className="p-4 text-muted-text font-medium">{label}</td>
      <td className="p-4 text-right font-mono font-bold text-white">{value}</td>
    </tr>
  );
}
