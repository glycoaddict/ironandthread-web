'use client';

import { useSession, SignInButton } from '@clerk/nextjs';
import { useEffect, useState, use } from 'react';
import { createClerkSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export default function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Unwrap the dynamic route params
  const { slug } = use(params);
  
  // 2. Auth and State
  const { session, isLoaded } = useSession();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for Clerk to load the session
    if (!isLoaded) return;

    // If no session, stop loading (the UI will show the Login prompt)
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClerkSupabaseClient(session);
        
        const { data, error: sbError } = await supabase
          .from('chapters')
          .select('content, front_matter, published_at')
          .eq('slug', slug)
          .single();

        if (sbError) throw sbError;
        if (!data) throw new Error("Chapter not found");

        setChapter(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load chapter.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, isLoaded, slug]);

  // 3. Render States
  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center min-h-screen text-gray-500">Opening the chronicles...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">This chapter is for authorized readers only.</h2>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-6 py-2 rounded-lg">Sign In to Read</button>
        </SignInButton>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-xl text-red-600 mb-4">{error || "Chapter not found."}</h2>
        <Link href="/" className="text-blue-600 underline">Return Home</Link>
      </div>
    );
  }

  // 4. Successful Reader View
  return (
    <main className="min-h-screen bg-white">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif font-bold text-lg hover:opacity-70">Iron & Thread</Link>
          <span className="text-sm text-gray-400 font-mono uppercase tracking-widest">Chapter {slug}</span>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto py-16 px-6 sm:px-0">
        {/* Pulling title from the front_matter JSONB column */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
            {chapter.front_matter?.title || `Chapter ${slug}`}
          </h1>
          {chapter.published_at && (
            <time className="text-gray-400 text-sm italic">
              {new Date(chapter.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </time>
          )}
          <div className="mt-6 h-1 w-20 bg-black mx-auto"></div>
        </header>

        {/* The Markdown Content rendered as HTML */}
        <section 
          className="prose prose-slate lg:prose-xl prose-headings:font-serif prose-p:leading-relaxed mx-auto"
          dangerouslySetInnerHTML={{ __html: chapter.content }} 
        />
        
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <Link href="/" className="text-gray-400 hover:text-black transition-colors">
            End of Chapter {slug}. Back to index?
          </Link>
        </footer>
      </article>
    </main>
  );
}