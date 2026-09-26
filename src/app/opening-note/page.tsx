import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

const noteContent = String.raw`(This is going to be turned into an opening note later. But enjoy it here now!)

Welcome, friend! If you are here, it means that you are a beta reader for Iron and Thread. I am grateful to you for going on this adventure with me, and I hope #both# of us will make it to the end.

Writing—as I was so fond of always telling my students—has to be done for and with readers; otherwise, the cloistered writer is doing the writing equivalent of the proverbial tree-falling-in-a-forest-does-it-really-make-sound. ###I am hoping you will tell me through any of our means of communication—zhemistry@gmail.com, WhatsApp chat, coffee (yes, a proper modality)###—how the work is landing with you. It doesn’t have to be literary critique, just a reader’s response! Things like: #Is it funny? Did something confuse you? If so, what would help with clarity? Do you like any of the characters? Did anything speak to you?#

Speaking of speaking: This project was birthed out of a joke of an idea I had while reading marriage contract comedies. I was trying to think about the worst possible way to trap someone in this trope, and that someone turned out to be a prince who was as gifted as he was vain (you might see, in the comedy, vestiges of that first idea where Amril was written as an airhead). Then I made the political landscape as flat as possible (I literally flattened it into a Disc and made the racial profile binary). But then I wrote the wedding vows for this world:

The Vow of Iron

#I stand for iron,#

#To bend not to others, but only to you.#

#I give to you the strength of all my days and all that I am.#

#I will not break from you in the furnace of life.#

#May we be forged together as one.#

The Vow of Thread

#I stand for thread,#

#To bind not to others, but only to you.#

#I give to you the length of all my days and all that I am.#

#I will not unravel from you in the loom of life.#

#May we be woven together as one.#

The Vow of Difference

#We do not promise to become the same.#

#We promise to become one.#

#We do not swear to untangle every knot,#

#We swear that we will be bound up together.#

#We do not swear we will dull our edges,#

#We swear that iron will sharpen iron.#

#We swear to stand different,#

#Yet equal, and to face the world as one.#

I realized that the story was already speaking about #marriage as a covenant# (and also psychological differentiation in relationships but never mind that for now), though I certainly did not intend anything deeper than silly gags when I set out to write. How did we get here? I think it is because the writer is a believer who happens to be making art.

The best definition I understand of Christian art is not art that reenacts the Bible in another modality or even mentions the word Christ. It is art that comes from a believer because her beliefs will come through somehow. (That was certainly the case for me, considering that I started trying to write slapstick nonsense about a guy who knew how to destroy three ministers by breakfast and win fencing bouts without disrupting his hairstyle, but went into paroxysms of over-planning in trying to approach his own wife**.)** For those of you who are familiar with the Bible, the mythos of the introduction will remind you immediately of Genesis. I was not trying to be subtle.

I hope you will also find the less subtle infusions in the writing and turn them over in your mind. For example, there is a concept to which the chaotic Rakkans turn: mystery, or the idea that there is a hiddenness about the world that a follower uncovers as the divine is pleased to reveal (Proverbs 25:2). The Rakkan shorthand is “dance with the mystery.” And there is a concept that ordered Altans turn to: sovereignty and election. The divine has a will for a follower to walk in. The Altans say, “Follow the order and be obedient to the path.” So, which is the right religious worldview? If I were Tim Keller, I would say, “Yes.”

But more on that later; back to marriage as covenant. God is too great for us to reduce into mere description. Instead, he gives us brief glimpses of himself and his character through different word-pictures that he has placed on this world. Any good thing you can see on earth—food, friendship, beauty, adoption, wine, pleasure, laughter, joy, art—all these things, in some way or form, reflect God or his goodness. There’s even a facet for the loving caregiving of pets. I’ll fight you over this one if I have to, since, in Genesis, God gives the task of naming the animals to Adam, then Noah is asked to shelter two of each animal in the ark, and in Psalm 104, it says #"The young lions roar for their prey, seeking their food from God."# If those don’t resonate with giving Fluffy his true cat name (Bailey Lewis Catnip), a warm cat box indoors as shelter against the wind and rain, and enough high-protein, low-potassium cat food, I don’t know what does.

And what about the Christian belief about marriage? I am not talking about Christian laws or ethics about marriage. I want to go a step higher than that to the spirit of it. Marriage is made to be a covenantal relationship. Not a contract. The scene that comes to mind when I think of a marriage contract is Barney Stinson and Quinn Garvey from #How I Met Your Mother# about to get married and reviewing pages and pages of clauses to ensure they get what they want from each other if they are going to be bound in matrimony. As they work through their negotiations, they fall silent. Even they know—well-suited as they are in their blindness, worldliness, and malice—that a contract cannot make a marriage.

In sum, my story is about finding out what happens when someone tries to do just that and then discovers that marriage must be covenantal, or else.

Or else what?

The answer is in the title:

The Prince’s Marriage Contract Breaks the World`;

const formattedNote = noteContent
  .replace(/###([\s\S]*?)###/g, '**$1**')
  .replace(/#([^#\n]+)#/g, '**$1**');

export default function OpeningNotePage() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-gray-300 bg-parchment">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-4 md:gap-12 text-sm tracking-widest uppercase">
          <Link href="/" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
            Iron &amp; Thread
          </Link>
          <Link href="/opening-note" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
            Opening Note
          </Link>
          <Link href="/#chapters" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">
            Chapters
          </Link>
          <Link href="/gallery" className="hidden md:inline-block text-gray-700 hover:text-gray-900 whitespace-nowrap">
            Gallery
          </Link>
          <Link href="/world-notes" className="hidden lg:inline-block text-gray-700 hover:text-gray-900 whitespace-nowrap">
            World Notes
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 sm:py-20">
        <article className="max-w-2xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              In Which There Is: An Overarching Explanation About This Project and a Sneak Peek at the Covenant of Joining Hands!
            </h1>
            <div className="mt-6 h-1 w-20 bg-black mx-auto" />
          </header>

          <section className="prose prose-slate mx-auto font-serif prose-p:my-8 prose-p:leading-relaxed prose-headings:font-serif">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {formattedNote}
            </ReactMarkdown>
          </section>
        </article>
      </main>
    </div>
  );
}