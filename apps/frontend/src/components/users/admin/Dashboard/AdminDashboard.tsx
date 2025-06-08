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

const AdminDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddSchoolClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const quickActions = [
    {
      label: 'Add New School',
      icon: School,
      variant: 'default' as const,
      onClick: handleAddSchoolClick,
    },
    { label: 'Add New Student', icon: UserPlus, variant: undefined },
    { label: 'Add New Teacher', icon: UserPlus, variant: undefined },
    { label: 'Create Exam Schedule', icon: BookOpen, variant: undefined },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MainCard title="No of Schools" description="30" />
            <MainCard title="No of Students" description="300" />
            <MainCard title="No of Teachers" description="25" />
            <MainCard title="Fees Collected" description="₹1,20,000" />
          </div>
        </div>

        <div className="sticky top-4 h-fit">
          <QuickActionsCard title="Quick Actions" actions={quickActions} />
        </div>
      </div>

      {/* Professional Drawer using shadcn Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-semibold flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Add New School
            </SheetTitle>
            <SheetDescription>
              Create a new educational institution in your system. Fill out the
              form below with the school details.
            </SheetDescription>
          </SheetHeader>

          <div className="pr-6">
            <AddOrganisationForm onFormSubmit={handleCloseDrawer} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminDashboard;
