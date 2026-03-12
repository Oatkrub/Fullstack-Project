'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import Comments from '@/app/components/Comments';
import InteractionBar from '@/app/components/InteractionBar';

export default function BlogPostPage() {
  const params = useParams();
  const id = params.id; 
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/content/${id}`, {
          credentials: 'include' 
        });
        const data = await res.json();
        if (data.success) setPost(data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center">Post not found</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <Navigation />
      
      <article className="max-w-2xl mx-auto px-4 py-20">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.header}</h1>
          <p className="text-xl text-gray-500 italic">{post.subHeader}</p>
          
          <div className="flex items-center gap-3 mt-6 text-sm text-gray-400">
            <span className="font-bold text-black dark:text-white">
              {post.author?.username}
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none leading-relaxed text-lg">
          {post.content} {/* Changed from post.description to post.content to match your Schema */}
        </div>

        <hr className="my-12 border-gray-100 dark:border-zinc-800" />
        
        {/* FIXED PROPS: Passing post object and the setPost function */}
        <InteractionBar post={post} updatePostState={setPost} />
        
        <Comments contentId={post._id} />
      </article>
    </main>
  );
}