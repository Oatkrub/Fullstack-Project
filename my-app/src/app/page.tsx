'use client';
import { useState, useEffect } from 'react';
import Navigation from '../app/components/Navigation';
import BlogCard from '../app/components/BlogCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/content');
        const json = await res.json();
        if (json.success) setPosts(json.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Pagination logic stays the same...
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (loading) return <div className="p-10 text-center">Loading knowledge...</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navigation />
      <section className="max-w-2xl mx-auto px-4 mt-10">
        {currentPosts.map(post => (
          <BlogCard key={post._id} post={post} />
        ))}
        {/* ... Pagination Buttons ... */}
      </section>
    </main>
  );
}