import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.post(`/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage(response.data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-cyan-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">IIoT Security Dashboard</h1>
        </div>

        {/* Content Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center">
          
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying Your Email</h2>
              <p className="text-slate-400">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified! 🎉</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              
              <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-300">
                  <strong className="text-amber-400">What's Next?</strong><br/>
                  An administrator will review your account. You'll receive an email once your account is approved.
                </p>
              </div>

              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all"
              >
                Go to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-slate-400 mb-6">{message}</p>
              
              <div className="space-y-4">
                <Link 
                  to="/signup" 
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Sign Up Again
                </Link>
                <Link 
                  to="/login" 
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}

          {status === 'no-token' && (
            <>
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No Verification Token</h2>
              <p className="text-slate-400 mb-6">
                Please use the verification link sent to your email, or request a new one.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/signup" 
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
