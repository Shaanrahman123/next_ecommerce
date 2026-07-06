'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import {
  HomeSection,
  HomeSectionInner,
  IndianSectionHeader,
  FestiveCard,
} from '@/components/home/indian/IndianDecor';

const reviews = [
  { id: 1, name: 'Madhu Soundharya', rating: 5, text: 'The fabric quality is awesome. Both casual and ethnic wear are excellent.' },
  { id: 2, name: 'Lejaswi Chavan', rating: 5, text: "I'm in love with this brand. Amazing fabric quality and a very user-friendly app." },
  { id: 3, name: 'Devika Bhattarai', rating: 5, text: 'Sleek interface and a wide range of clothing. A well-crafted shopping experience.' },
  { id: 4, name: 'Trisha Jha', rating: 5, text: 'My first choice for suit sets. Soothing colors, breathable fabric, great value.' },
];

const CARD_ACCENTS = ['amber', 'rose', 'maroon', 'saffron'] as const;

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => setReviewsPerPage(window.innerWidth < 768 ? 1 : 3);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextReviews = () =>
    setCurrentIndex((prev) => (prev + reviewsPerPage >= reviews.length ? 0 : prev + 1));
  const prevReviews = () =>
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - reviewsPerPage : prev - 1));

  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);
  const displayReviews = reviewsPerPage === 1 ? reviews : visibleReviews;

  return (
    <HomeSection tone="blush" pattern="rangoli">
      <HomeSectionInner>
        <IndianSectionHeader
          badge="Testimonials"
          title="Customer"
          titleAccent="Reviews"
          subtitle="Stories from shoppers who love our collection."
          align="center"
        />

        <div className="relative">
          <button
            onClick={prevReviews}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 items-center justify-center bg-white/90 rounded-full shadow-md border border-amber-200/60 hover:border-amber-400 transition-all"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5 text-amber-900" />
          </button>
          <button
            onClick={nextReviews}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 items-center justify-center bg-white/90 rounded-full shadow-md border border-amber-200/60 hover:border-amber-400 transition-all"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5 text-amber-900" />
          </button>

          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide pb-1">
            {displayReviews.map((review, i) => (
              <FestiveCard key={review.id} accent={CARD_ACCENTS[i % CARD_ACCENTS.length]} className="min-w-[80vw] md:min-w-0 snap-center">
                <div className="p-5 lg:p-6 relative">
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-amber-200" />
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.text}</p>
                  <p className="text-sm font-semibold text-heading">{review.name}</p>
                </div>
              </FestiveCard>
            ))}
          </div>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
