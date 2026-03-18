import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Users, Key, LayoutDashboard } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Licenses from './pages/Licenses';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">POS Admin</h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  to="/customers"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Customers</span>
                </Link>
                <Link
                  to="/licenses"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Key className="w-5 h-5" />
                  <span className="font-medium">Licenses</span>
                </Link>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 POS Platform
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="ml-64">
            <div className="p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/licenses" element={<Licenses />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
