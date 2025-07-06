import UserProfileCard from '@/components/users/student/Profile/ProfileCard/ProfileCard';
import React from 'react';

const RightNavigation = () => {
  return (
    <div className='py-4 px-0 sm:px-4 md:px-6 lg:px-8 flex flex-col gap-4'>
      <UserProfileCard />
    </div>
  );
};

export default RightNavigation;
