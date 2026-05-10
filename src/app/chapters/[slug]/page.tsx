'use client';

import { useSession, SignInButton } from '@clerk/nextjs';
import { useEffect, useState, use, useTransition } from 'react';
import { createClerkSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useInView } from 'react-intersection-observer';

export default function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: initialSlug } = use(params);
  const { session, isLoaded } = useSession();
  
  // 1. Change single chapter to an Array for infinite scroll
  const [chapters, setChapters] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Setup the "Bottom of Page" trigger
  const { ref, inView } = useInView({
    rootMargin: '400px', // Fetch when reader is 400px from the bottom
  });

  // Initial Data Load
  useEffect(() => {
    if (!isLoaded || !session) {
      if (isLoaded && !session) setLoadingInitial(false);
      return;
    }

    const fetchInitial = async () => {
      try {
        const supabase = createClerkSupabaseClient(session);
        const { data, error: sbError } = await supabase
          .from('chapters')
          .select('*')
          .eq('slug', initialSlug)
          .single();

        if (sbError) throw sbError;
        setChapters([data]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitial();
  }, [session, isLoaded, initialSlug]);

  // 3. The Infinite Scroll Logic (Slug + 1)
  useEffect(() => {
    if (inView && hasMore && !isPending && chapters.length > 0) {
      loadNextChapter();
    }
  }, [inView, hasMore, isPending]);

  const loadNextChapter = () => {
    startTransition(async () => {
      if (!session) return;
      
      const lastSlug = parseInt(chapters[chapters.length - 1].slug);
      const nextSlug = lastSlug + 1;
      
      const supabase = createClerkSupabaseClient(session);
      const { data } = await supabase
        .from('chapters')
        .select('*')
        .eq('slug', nextSlug.toString())
        .maybeSingle();

      if (data) {
        setChapters((prev) => [...prev, data]);
        // UX: Update browser URL as reader progresses
        window.history.replaceState(null, '', `/chapters/${nextSlug}`);
      } else {
        setHasMore(false);
      }
    });
  };

  if (!isLoaded || loadingInitial) {
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

  return (
    <main className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif font-bold text-lg">Iron & Thread</Link>
          <span className="text-sm text-gray-400 font-mono uppercase tracking-widest">
            Reading Mode
          </span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-0">
        {chapters.map((ch, idx) => (
          <article key={ch.slug} className="py-16 border-b border-gray-50 last:border-0">
            <header className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                {ch.front_matter?.title || `Chapter ${ch.slug}`}
              </h1>
              <time className="text-gray-400 text-sm italic">
                {new Date(ch.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </time>
              <div className="mt-6 h-1 w-20 bg-black mx-auto"></div>
            </header>

            <section 
                className="
                    prose prose-slate lg:prose-xl mx-auto                    
                    prose-p:leading-loose   /* Increases line-height for easier reading */
                    prose-headings:font-serif
                "
                >
              <ReactMarkdown>{ch.content}</ReactMarkdown>
            </section>
          </article>
        ))}

        {/* Scroll Target */}
        <div ref={ref} className="h-40 flex flex-col items-center justify-center pb-20">
          {isPending && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-t-transparent border-black rounded-full animate-spin" />
              <p className="text-sm italic text-gray-400">Loading next chapter...</p>
            </div>
          )}
          {!hasMore && (
            <p className="text-gray-400 font-serif italic border-t pt-8 w-full text-center">
              You've reached the end of the current chronicles.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}