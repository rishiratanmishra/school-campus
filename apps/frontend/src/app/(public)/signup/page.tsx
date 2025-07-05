'use client';

import AddCreateUserForm from '@/components/users/common-ui/profile/authForms/CreateUser/AddCreateUserForm';
import { motion } from 'framer-motion';
import React from 'react';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        className="w-full max-w-md px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Join Us</h1>
            <p className="text-white/80 mt-2">Create your account in seconds</p>
          </div>
          <AddCreateUserForm />
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;