import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, Globe, BookOpen, MapPin, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Organisation {
  _id: string;
  name: string;
  slug: string;
  domain: string;
  established: string;
  affiliationCode: string;
  affiliationType: string;
  description: string;
  organisationType: string;
  boardType: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }[];
  adminIds: string[];
  createdAt: string;
  updatedAt: string;
}

const OrganisationDetails = ({ organisation }: { organisation: Organisation }) => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Organisation Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to List
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {organisation?.name}
                <Badge variant={organisation?.organisationType === "SCHOOL" ? "default" : "secondary"}>
                  {organisation?.organisationType}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">{organisation?.affiliationCode}</p>
            </div>
            <Button asChild variant="ghost">
              <a href={organisation?.domain} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{organisation?.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Board Type</p>
                <p>{organisation?.boardType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Established</p>
                <p>{new Date(organisation?.established).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{new Date(organisation?.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organisation?.address?.length > 0 ? (
              organisation?.address?.map((addr, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium">{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No address information available</p>
            )}
          </CardContent>
        </Card>

        {/* Admin Information */}
        {organisation?.adminIds?.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Administrators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {organisation?.adminIds?.map((adminId) => (
                  <div key={adminId} className="border rounded-lg p-4">
                    <p className="font-medium">Admin ID: {adminId}</p>
                    {/* You would typically fetch and display admin details here */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline">Edit Details</Button>
        <Button>Manage Admins</Button>
      </div>
    </div>
  );
};

export default OrganisationDetails;