'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

export default function CreatePost() {
  const [form, setForm] = useState({ header: '', subHeader: '', content: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/v1/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        // Important: This sends the JWT cookie from your browser
        credentials: 'include', 
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/blog/${data.data._id}`); // Go to the new post
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900">
      <Navigation />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-6">
        <input 
          type="text"
          placeholder="Title"
          className="text-4xl font-serif font-bold outline-none bg-transparent border-l-2 border-transparent focus:border-gray-200 dark:focus:border-zinc-700 pl-4"
          onChange={(e) => setForm({...form, header: e.target.value})}
          required
        />
        <input 
          type="text"
          placeholder="Subtitle (Short description)"
          className="text-xl italic text-gray-500 bg-transparent outline-none pl-4"
          onChange={(e) => setForm({...form, subHeader: e.target.value})}
          required
        />
        <textarea 
          placeholder="Tell your story..."
          rows={15}
          className="text-lg leading-relaxed outline-none bg-transparent pl-4 resize-none"
          onChange={(e) => setForm({...form, content: e.target.value})}
          required
        />
        
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>
      </form>
    </main>
  );
}