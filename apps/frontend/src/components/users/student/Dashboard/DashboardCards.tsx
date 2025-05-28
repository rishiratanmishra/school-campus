import { Card, CardContent } from '@/components/ui/card';

const DashboardCards = () => {
  return (
    <>
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-600">
              Here you can manage your profile, view your courses, and track
              your progress.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardCards;
