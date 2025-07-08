'use client';

import AddLoginUserForm from '@/components/users/common-ui/profile/authForms/LoginUser/AddLoginUserForm';
import { selectIsAuthenticated } from '@/store/auth/AuthenticationSlice';
import { motion } from 'framer-motion';
import { LogIn, Users, BookOpen, Target, Sparkles } from 'lucide-react';
import React, { use, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const features = [
    { icon: Users, text: 'Connect with peers' },
    { icon: BookOpen, text: 'Access resources' },
    { icon: Target, text: 'Track progress' },
  ];

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          {/* Left side - Hero content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-4 w-4" />
                Welcome back to Campus Connect
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Continue Your
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Journey
                </span>
              </h1>

              <p className="text-xl text-white/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Access your Campus Connect dashboard and continue building
                India's educational future.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <feature.icon className="h-4 w-4" />
                  {feature.text}
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-white/60">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/60">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-white/60">Cities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <AddLoginUserForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
