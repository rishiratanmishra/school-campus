'use client';

import AddCreateUserForm from '@/components/users/common-ui/profile/authForms/CreateUser/AddCreateUserForm';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Users, BookOpen, Target } from 'lucide-react';
import React from 'react';

const SignUpPage = () => {
  const features = [
    { icon: Users, text: 'Connect with peers' },
    { icon: BookOpen, text: 'Access resources' },
    { icon: Target, text: 'Track progress' },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_50%)]" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] h-full w-full max-w-7xl mx-auto items-center gap-6">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-6 px-2 sm:px-4 md:px-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-xs border border-white/20">
              <Sparkles className="h-4 w-4" />
              New to School Campus?
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Build India's{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Future
              </span>
            </h1>

            <p className="text-white/80 text-base md:text-lg lg:text-xl max-w-xl">
              Join schools, empower learning, and transform education from the
              ground up.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-xs border border-white/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <feature.icon className="h-4 w-4" />
                  {feature.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            className="w-full max-w-md mx-auto my-auto rounded-2xl scrollbar-hide"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl  relative">
              <AddCreateUserForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
