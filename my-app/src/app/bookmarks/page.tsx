'use client';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function BookmarksPage() {
  const { user, isLoading } = useApp();
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/social/bookmarks', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) setPosts(data.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks");
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchBookmarks();
  }, [user]);

  if (isLoading || fetching) return <div className="p-10 text-center">Loading your library...</div>;

  if (!user) return <div className="p-10 text-center">Please login to see bookmarks.</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Reading List
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed dark:border-zinc-800 rounded-2xl">
            <p className="text-gray-500">You haven't bookmarked anything yet.</p>
            <Link href="/" className="text-blue-600 mt-2 inline-block hover:underline">
              Explore stories
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post: any) => (
              <div key={post._id} className="group">
                <Link href={`/blog/${post._id}`}>
                  <p className="text-xs text-gray-500 mb-1">
                    {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {post.header}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                    {post.subHeader}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}