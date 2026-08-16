import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}
