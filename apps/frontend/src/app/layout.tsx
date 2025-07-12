import AppProviders from '@/lib/providers/AppProviders';
import './globals.css';

export const metadata = {
  title: 'School Campus',
  description: 'Campus Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
