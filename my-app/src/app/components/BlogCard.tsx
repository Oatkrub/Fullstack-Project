import Link from 'next/link';

export default function BlogCard({ post }) {
  return (
    <article className="py-8 border-b border-gray-100 dark:border-zinc-800">
      {/* Author Top Left */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gray-200 rounded-full" /> 
        <span className="text-xs font-semibold">{post.author.username}</span>
      </div>

      {/* Content */}
      <Link href={`/blog/${post._id}`}>
        <div className="group cursor-pointer">
          <h2 className="text-2xl font-bold mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-400">
            {post.header}
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 line-clamp-2 italic">
            {post.subHeader}
          </p>
        </div>
      </Link>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span>{post.readingTime} min read</span>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </article>
  );
}