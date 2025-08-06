import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle, Users, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Email() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // Mock navigate function
  // const navigate = (path) => console.log(`Navigate to: ${path}`);
  const navigate = useNavigate()

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setEmailExists(false);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit() {
    if (!email || !password) {
      setEmailExists(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful registration
      setConfirmEmail(true);
    }, 2000);
  }

  function handleLoginRedirect() {
    navigate('/login');
  }

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  if (confirmEmail) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '500ms'}}></div>
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-lg">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-green-500/20 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-green-400 mb-4">
                Registration Successful! 🎉
              </h1>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                <Mail className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-green-200 text-lg font-medium mb-2">
                  Verification email sent!
                </p>
                <p className="text-gray-300">
                  We've sent a confirmation link to <span className="text-green-400 font-medium">{email}</span>. 
                  Please check your inbox and click the link to verify your account.
                </p>
              </div>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>Didn't receive the email? Check your spam folder or contact support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '500ms'}}></div>
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-lg">
            {/* Logo area */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
                <p className="text-purple-300 text-sm">Join the Community</p>
              </div>
            </div>

            {/* Hero content */}
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Start your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}productivity journey
              </span>
              {" "}today
            </h2>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Join thousands of professionals who have transformed their workflow with TaskMaster's powerful features.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Shield, text: "Secure & encrypted data" },
                { icon: Users, text: "Collaborative workspaces" },
                { icon: Zap, text: "Lightning-fast performance" }
              ].map(({ icon: Icon, text }, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                { number: "50K+", label: "Happy Users" },
                { number: "10M+", label: "Tasks Created" },
                { number: "99.9%", label: "Satisfaction" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-purple-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
              </div>
              <p className="text-gray-400">Create your account</p>
            </div>

            {/* Registration card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Welcome text */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400">Enter your details to get started</p>
              </div>

              {/* Google Sign-up */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-6 py-3 transition-all duration-300 transform hover:scale-[1.02] mb-6 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white font-medium">Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/50 text-gray-400">or sign up with email</span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 
                              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                              ${emailExists ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/20 hover:border-white/30"}`}
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 
                              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                              ${emailExists ? "border-red-500/50 ring-1 ring-red-500/50" : "border-white/20 hover:border-white/30"}`}
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>

                {/* Error message */}
                {emailExists && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      ❗ This email is already registered. Please{" "}
                      <button
                        onClick={handleLoginRedirect}
                        className="text-blue-400 hover:text-blue-300 underline font-medium"
                      >
                        sign in instead
                      </button>
                      .
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
                           text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]
                           shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                           flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Sign in link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <button
                    onClick={handleLoginRedirect}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>

            {/* Bottom text */}
            <p className="text-center text-gray-500 text-xs mt-8">
              By creating an account, you agree to our{" "}
              <button className="hover:text-gray-400 transition-colors">Terms of Service</button>
              {" "}and{" "}
              <button className="hover:text-gray-400 transition-colors">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Email;