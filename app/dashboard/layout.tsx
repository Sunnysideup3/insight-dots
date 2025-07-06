export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Insight Dots</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                New Note
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}