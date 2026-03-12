'use client';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Comments({ contentId }: { contentId: string }) {
  const { user } = useApp();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:5000/api/v1/social/comments/${contentId}`);
    const data = await res.json();
    if (data.success) setComments(data.data);
  };

  useEffect(() => { fetchComments(); }, [contentId]);

  const postComment = async () => {
    if (!text.trim()) return;
    const res = await fetch(`http://localhost:5000/api/v1/social/comments/${contentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      credentials: 'include'
    });
    if (res.ok) {
      setText("");
      fetchComments();
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-xl font-bold">Responses ({comments.length})</h3>
      
      {user && (
        <div className="p-4 rounded-lg shadow-sm border dark:border-zinc-800">
          <textarea 
            className="w-full bg-transparent outline-none resize-none" 
            placeholder="What are your thoughts?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button onClick={postComment} className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">Respond</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((c: any) => (
          <div key={c._id} className="border-b dark:border-zinc-800 pb-4">
            <p className="text-sm font-bold mb-1">{c.author?.username}</p>
            <p className="text-gray-600 dark:text-gray-400">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}