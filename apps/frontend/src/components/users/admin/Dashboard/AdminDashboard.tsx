import React from 'react'
import { School, UserPlus, BookOpen } from 'lucide-react' 
import { MainCard, QuickActionsCard } from './DashboardCardComponents/MainCard'

const AdminDashboard = () => {
  const quickActions = [
    { label: 'Add New School', icon: School, variant: 'default' as const },
    { label: 'Add New Student', icon: UserPlus, variant: undefined },
    { label: 'Add New Teacher', icon: UserPlus, variant: undefined },
    { label: 'Create Exam Schedule', icon: BookOpen, variant: undefined },
  ]

  return (
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
  )
}

export default AdminDashboard
