export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Task<span className="text-primary-600">Flow</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Personal task management</p>
        </div>
        {children}
      </div>
    </div>
  )
}
