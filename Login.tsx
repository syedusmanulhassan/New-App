
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole } from '../types';
import { Package, Lock, User, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    login(username, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30 mb-6">
            <Package className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RefurbHub Pro</h1>
          <p className="text-slate-400">Batch Tracking & Daily Operations Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex">
            <button 
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${!isSignup ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${isSignup ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Username / Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" required value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} required
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Access Role</label>
                <select 
                  value={role} onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none"
                >
                  <option value={UserRole.ADMIN}>Administrator</option>
                  <option value={UserRole.TECHNICIAN}>Technician</option>
                  <option value={UserRole.VIEWER}>Warehouse Viewer</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95">
              {isSignup ? 'Create Account' : 'Secure Sign In'}
            </button>

            {!isSignup && (
              <div className="text-center">
                <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition font-medium">Forgot your password?</a>
              </div>
            )}
          </form>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs">
          &copy; 2024 RefurbHub Solutions LLC. All rights reserved.<br/>
          Unauthorized access is strictly prohibited.
        </p>
      </div>
    </div>
  );
};

export default Login;
