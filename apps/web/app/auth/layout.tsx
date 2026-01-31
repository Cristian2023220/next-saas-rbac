
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<div lang="en" className="min-h-screen flex iten-center justify-center flex-colol px-4">
    <div className="w-full max-w-xs">
      {children}
    </div>
    </div>)
}
