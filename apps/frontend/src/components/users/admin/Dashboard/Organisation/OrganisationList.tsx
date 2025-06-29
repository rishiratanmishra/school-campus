import { useRouter } from 'next/navigation';
import React from 'react';

const OrganisationList = ({ organisations }: { organisations: any[] }) => {
  const router = useRouter();

  const handleCardClick = (orgId: string) => {
    router.push(`/admin/organisation/${orgId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Organisations
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organisations.map((org) => (
          <div
            key={org._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            onClick={() => handleCardClick(org._id)}
          >
            <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white truncate">
                {org.name}
              </h2>
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  org.organisationType.toLowerCase() === 'school'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                } text-white`}
              >
                {org.organisationType}
              </span>
            </div>

            <div className="p-4">
              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  {org.boardType}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {new Date(org.established).getFullYear()}
                </span>
              </div>

              <p className="text-gray-700 text-sm line-clamp-3">
                {org.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganisationList;
