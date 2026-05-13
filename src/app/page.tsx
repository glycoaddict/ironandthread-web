'use client';
import { getSupabaseImageUrl } from '@/lib/supabase';
import Link from 'next/link';
import { useSession } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const chapters = [
  {
    id: 1,
    title: 'Amril of Alta',
    number: 'ONE',
  },
  {
    id: 2,
    title: 'Syasha',
    number: 'TWO',
  },
];

export default function Home() {
  const { session, isLoaded } = useSession();
  const [thematicImageUrl, setThematicImageUrl] = useState<string | undefined>();
  const [thematicImageUrl2, setThematicImageUrl2] = useState<string | undefined>();

  useEffect(() => {
    if (!isLoaded || !session) return;

    (async () => {
      const [url1] = await Promise.all([        
        getSupabaseImageUrl(session, 'media/iat1-1.png', 'images'),
      ]);

      setThematicImageUrl(url1 ?? undefined);      
    })();
  }, [session, isLoaded]);


  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-300 bg-parchment">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center gap-12 text-sm tracking-widest uppercase">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Iron & Thread
          </Link>
          <Link href="/opening-note" className="text-gray-700 hover:text-gray-900">
            Opening Note
          </Link>
          <Link href="/chapters" className="text-gray-700 hover:text-gray-900">
            Chapters
          </Link>
          <Link href="/gallery" className="text-gray-700 hover:text-gray-900">
            Gallery
          </Link>
          <Link href="/world-notes" className="text-gray-700 hover:text-gray-900">
            World Notes
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-serif tracking-wide mb-4">
            Iron & Thread
          </h1>
          <p className="text-sm tracking-widest uppercase text-gray-600 mb-6">
            The Prince's Marriage Contract Breaks the World
          </p>
          <p className="text-sm mb-8 text-gray-700">by Zhemistry</p>
          <p className="text-sm italic text-gray-600 mb-12 max-w-2xl mx-auto">
            A fantasy of order, chaos, hoofbeats, vows, and the dangerous things people call duty.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/chapters/1"
              className="px-8 py-2 border border-gray-700 text-gray-700 hover:bg-gray-50 text-sm tracking-widest uppercase text-center"
            >
              Start Reading
            </Link>
            <Link
              href="/opening-note"
              className="px-8 py-2 border border-gray-700 text-gray-700 hover:bg-gray-50 text-sm tracking-widest uppercase text-center"
            >
              Opening Note
            </Link>
            <Link
              href="/#chapters"
              className="px-8 py-2 border border-gray-700 text-gray-700 hover:bg-gray-50 text-sm tracking-widest uppercase text-center"
            >
              Chapters
            </Link>
          </div>
        </div>

        {/* Thematic Divider */}
        <div className="mx-auto mb-10 w-full max-w-3xl">          
          <img
            src={thematicImageUrl ?? '/placeholder-divider.jpeg'}
            alt="Thematic divider illustration"
            className="w-full rounded-3xl border border-gray-200 shadow-sm"
          />

        </div>

        {/* Chapters Section */}
        <div className="mt-32 border-t border-gray-300 pt-12">
          <h2 id="chapters" className="text-2xl font-serif text-center mb-2">Chapters</h2>
          <p className="text-sm font-serif text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Read the opening chapters of Iron and Thread below. This first version of the site contains the first two chapters in full. The complete structure is planned for twenty-five chapters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/chapters/${chapter.id}`}
                className="border border-gray-400 p-6 text-center hover:bg-gray-50 transition-colors"
              >
                <div className="text-xs tracking-widest uppercase text-gray-600 mb-2">
                  Chapter {chapter.number}
                </div>
                <h3 className="text-lg font-serif text-gray-900">
                  {chapter.title}
                </h3>
              </Link>
            ))}
          </div>

          <p className="text-center text-sm text-gray-600 mt-12">
            Chapters Three through Twenty-Five are coming later.
          </p>
        </div>
      </main>
    </div>
  );
}
