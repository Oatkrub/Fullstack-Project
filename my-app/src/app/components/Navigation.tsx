'use client';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, setUser, toggleTheme, isDark } = useApp();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // 1. Tell the backend to clear the cookie
      const res = await fetch('http://localhost:5000/api/v1/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        // 2. Clear local state
        setUser(null);
        // 3. Optional: Redirect to home or auth
        router.push('/');
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-serif">Knowledge</Link>
        
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2">{isDark ? '☀️' : '🌙'}</button>

          {user ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/create" className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span className="text-sm hidden sm:inline">Write</span>
              </Link>
              <Link href="/bookmarks" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium border-l pl-4 dark:border-zinc-700">
                  {user.username}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="bg-black text-white px-4 py-2 rounded-full text-sm dark:bg-white dark:text-black">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}