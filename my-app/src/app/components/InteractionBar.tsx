'use client';
import { useApp } from '../context/AppContext';

interface InteractionBarProps {
  post: any; 
  updatePostState: (updatedPost: any) => void;
}

export default function InteractionBar({ post, updatePostState }: InteractionBarProps) {
  const { user } = useApp();

  // 1. DATA NORMALIZATION (The Fix for "Loading all day" or Crashing)
  // If post.likedBy is undefined or null, we force it to be an empty array []
  const likedBy = post?.likedBy || [];
  const bookmarkedBy = post?.bookmarkedBy || [];

  // 2. DERIVED LOGIC
  const isLiked = user && likedBy.includes(user?._id);
  const isBookmarked = user && bookmarkedBy.includes(user?._id);
  const likesCount = likedBy.length;

  const handleToggle = async (type: 'like' | 'bookmark') => {
    if (!user) return alert("Please login to interact!");
    if (!post?._id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/social/toggle/${post._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
        credentials: 'include'
      });
      
      const data = await res.json();
      if (data.success) {
        updatePostState(data.data); 
      }
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  // If the post is still null (initial fetch), show a skeleton instead of nothing
  if (!post) {
    return <div className="h-14 w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md my-8" />;
  }

  return (
    <div className="flex items-center justify-between py-3 border-y dark:border-zinc-800 my-8">
      <div className="flex items-center gap-6">
        
        {/* LIKE BUTTON */}
        <button 
          onClick={() => handleToggle('like')} 
          className={`flex items-center gap-2 transition-all duration-200 ${
            isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'
          }`}
        >
          <svg 
            width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" 
            className={`transition-all duration-300 ${isLiked ? 'fill-current' : 'fill-none'}`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span className={`text-sm font-medium ${isLiked ? 'font-bold' : ''}`}>
            {likesCount}
          </span>
        </button>
        
        {/* COMMENT BUTTON */}
        <button className="flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="text-sm">Comment</span>
        </button>
      </div>

      {/* BOOKMARK BUTTON */}
      <button 
        onClick={() => handleToggle('bookmark')} 
        className={`${isBookmarked ? 'text-blue-600' : 'text-zinc-500 hover:text-blue-600'}`}
      >
        <svg 
          width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" 
          className={`transition-all duration-300 ${isBookmarked ? 'fill-current' : 'fill-none'}`}
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  );
}