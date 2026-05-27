import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [loginError, setLoginError] = useState('');
  const { user, loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setLoginError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGoogleLoginClick = async () => {
    setIsGoogleSigningIn(true);
    setGoogleError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setGoogleError(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black mb-6 text-slate-900">Login</h2>

        {loginError && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            {loginError}
          </div>
        )}

        {googleError && (
          <div className="mb-4 text-xs text-red-650 bg-red-50/70 p-4 rounded-xl border border-red-100 flex flex-col gap-2 shadow-xs transition-all">
            <div className="flex items-start space-x-2">
              <span className="text-red-500 font-bold text-sm mt-0.5">⚠️</span>
              <div className="flex-1">
                <span className="font-bold text-slate-900 block">Google Authentication Blocked / Cancelled</span>
                <span className="leading-relaxed text-slate-600 font-medium block mt-0.5">{googleError}</span>
              </div>
            </div>
            
            {(googleError.toLowerCase().includes('popup') || googleError.toLowerCase().includes('blocked') || googleError.toLowerCase().includes('api-key') || googleError.toLowerCase().includes('invalid')) && (
              <div className="mt-2.5 pt-2.5 border-t border-red-100/60 flex flex-col gap-2">
                <div className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  💡 Inside embedded browser frames or secure tabs without valid keys, browser restricts popups or API key errors occur. You can bypass this immediately with these verified options:
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <a 
                    href={window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-grow text-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[10.5px] uppercase transition-colors shadow-xs"
                  >
                    Open App in New Tab ↗
                  </a>
                  <button 
                    type="button"
                    onClick={() => {
                      setEmail('jane.doe@example.com');
                      setPassword('password123');
                    }}
                    className="flex-grow text-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[10.5px] uppercase transition-colors"
                  >
                    Quick-Fill Jane Doe User
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            id="login-email" 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
            required 
          />
          <div className="relative">
            <input 
              id="login-password"
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full p-3 pr-10 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
              required 
            />
            <button
              id="login-password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <button 
            id="login-submit" 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>



        {window.self !== window.top && (
          <div className="mt-6 p-4.5 bg-indigo-50/60 dark:bg-slate-900/40 rounded-2xl border border-indigo-100/60 dark:border-slate-800 text-center text-xs text-indigo-950 dark:text-slate-350 shadow-sm relative">
            <p className="font-bold mb-1 text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
              <span>🖥️</span> IFrame Environment Detected
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-450 mb-3 leading-relaxed">
              Google Auth popups are frequently blocked by default by browser privacy settings inside an embedded frame.
            </p>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg text-[11px] uppercase"
            >
              Open App in New Tab ↗
            </a>
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
