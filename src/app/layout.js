import "./globals.css";

export const metadata = {
  title: "CampusConnect",
  description: "A campus event discovery application for students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}