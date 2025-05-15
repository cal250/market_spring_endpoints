import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { CustomerList } from './components/CustomerList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Customer Management</h1>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <CustomerList />
        </main>
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
