'use client';

import React, { useState } from 'react';
import { School, UserPlus, BookOpen } from 'lucide-react';
import { MainCard, QuickActionsCard } from './DashboardCardComponents/MainCard';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AddOrganisationForm from '../forms/AddOrganisationForm';
import AddStudentForm from '../../student/forms/AddStudentForm';
import { useGetOrganisationList } from '@/service/OrganisationService';
import AddTeacherForm from '../../teacher/forms/AddTeacherForm';
import DashboardMenu from './DashboardMenu/DashboardMenu';

type DrawerType = 'organisation' | 'student' | 'teacher' | null;

const drawerConfig: Record<
  Exclude<DrawerType, null>,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    content: (onClose: () => void) => JSX.Element;
  }
> = {
  organisation: {
    title: 'Add New School',
    description: 'Fill out the form below with the school details.',
    icon: <School className="h-5 w-5 text-primary" />,
    content: (onClose) => <AddOrganisationForm onFormSubmit={onClose} />,
  },
  student: {
    title: 'Add New Student',
    description: 'Fill out the form below with the student details.',
    icon: <UserPlus className="h-5 w-5 text-primary" />,
    content: (onClose) => <AddStudentForm onFormSubmit={onClose} />,
  },
  teacher: {
    title: 'Add New Teacher',
    description: 'Fill out the form below with the teacher details.',
    icon: <UserPlus className="h-5 w-5 text-primary" />,
    content: (onClose) => <AddTeacherForm onFormSubmit={onClose} />,
  },
};

const AdminDashboard = () => {
  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const isDrawerOpen = drawerType !== null;

  const { data: organisationList } = useGetOrganisationList({});

  const openDrawer = (type: DrawerType) => setDrawerType(type);
  const closeDrawer = () => setDrawerType(null);

  const quickActions = [
    {
      label: 'Add New School',
      icon: School,
      variant: 'default' as const,
      onClick: () => openDrawer('organisation'),
    },
    {
      label: 'Add New Student',
      icon: UserPlus,
      variant: undefined,
      onClick: () => openDrawer('student'),
    },
    {
      label: 'Add New Teacher',
      icon: UserPlus,
      variant: undefined,
      onClick: () => openDrawer('teacher'),
    },
    { label: 'Create Exam Schedule', icon: BookOpen, variant: undefined },
  ];

  const currentDrawer = drawerType ? drawerConfig[drawerType] : null;

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 10 , height: '64px' }} >
        <DashboardMenu />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MainCard
              title="No of Schools"
              description={organisationList?.pagination?.totalRecords || 0}
            />
            <MainCard title="No of Students" description="300" />
            <MainCard title="No of Teachers" description="25" />
            <MainCard title="Fees Collected" description="₹1,20,000" />
          </div>
        </div>

        <div className="sticky top-4 h-fit">
          <QuickActionsCard title="Quick Actions" actions={quickActions} />
        </div>
      </div>

      {/* Drawer for Add Forms */}
      <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
        <SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
          {currentDrawer && (
            <>
              <SheetHeader className="pb-6">
                <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                  {currentDrawer.icon}
                  {currentDrawer.title}
                </SheetTitle>
                <SheetDescription>{currentDrawer.description}</SheetDescription>
              </SheetHeader>
              <div className="pr-6">{currentDrawer.content(closeDrawer)}</div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminDashboard;
