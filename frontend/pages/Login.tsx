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
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setLoginError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 flex items-start space-x-2">
            <span className="text-red-500 font-bold">⚠️</span>
            <div>
              <span className="font-semibold block">Authentication failed</span>
              <span>{googleError}</span>
            </div>
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

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider absolute">or</span>
        </div>

        {/* Continue with Google button with improved layout and interactive feedback */}
        <button
          id="google-login-btn"
          type="button"
          disabled={isGoogleSigningIn}
          onClick={handleGoogleLoginClick}
          className="w-full flex items-center justify-center py-3.5 px-4 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/5 relative rounded-xl font-medium text-slate-700 bg-white transition-all cursor-pointer shadow-sm mb-4 duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isGoogleSigningIn ? (
            <div className="flex items-center space-x-2.5">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-600 font-semibold text-sm">Connecting with Google...</span>
            </div>
          ) : (
            <div className="flex items-center w-full">
              <div className="flex items-center justify-center bg-white p-1 rounded-full shadow-xs border border-slate-100 group-hover:scale-105 transition-transform duration-150">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.8 2.95c.9-2.7 3.4-4.47 6.81-4.47z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.74-4.92 3.74-8.6z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.19 14.91c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.39 7.56C.5 9.34 0 11.32 0 13.4s.5 4.06 1.39 5.84l3.8-2.95z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-3.41 0-5.91-1.77-6.81-4.47l-3.8 2.95C3.37 20.33 7.35 23 12 23z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-center pr-6">
                <span className="block font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors duration-150">Continue with Google</span>
                <span className="block text-[10.5px] text-slate-400 font-normal">Sign in instantly using your device Gmail account</span>
              </div>
            </div>
          )}
        </button>

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
