import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ children, showSidebar = false }) {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;