'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: 'Madhu Soundharya',
        rating: 5,
        text: 'The only brand which I kept buying again and again. The fabric quality is awesome. It feels so comfortable and soft. Both Casual wear and ethnic wear are good. The cost is also reasonable for the quality and fitting. I Love Libas',
    },
    {
        id: 2,
        name: 'Lejaswi Chavan',
        rating: 5,
        text: "I'm in love with this brand now. the quality of the fabric is amazing. The app is very user-friendly and easy to access.",
    },
    {
        id: 3,
        name: 'Devika Bhattarai',
        rating: 5,
        text: 'I recently tried out the Libas app, overall had a positive experience. The user interface is sleek and easy to navigate. I appreciated the wide range of clothing options available. Kudos to the developer team for developing such a well-crafted application.',
    },
    {
        id: 4,
        name: 'Trisha Jha',
        rating: 5,
        text: 'Libas has been my first choice for buying suit sets. The color palette is always soothing! The kurta set I bought from Libas had the perfect and breathable fabric. Its fit is comfortable. Libas represents quality product and is 100% reasonable!',
    },
];

export default function CustomerReviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviewsPerPage, setReviewsPerPage] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setReviewsPerPage(1);
            } else {
                setReviewsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextReviews = () => {
        setCurrentIndex((prev) =>
            prev + reviewsPerPage >= reviews.length ? 0 : prev + 1
        );
    };

    const prevReviews = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? reviews.length - reviewsPerPage : prev - 1
        );
    };

    const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

    return (
        <section className="py-6 px-4 lg:px-4 xl:px-4 container mx-auto">
            {/* Header */}
            <div className="text-center mb-4 lg:mb-8">
                <h2 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                    CUSTOMER REVIEWS
                </h2>
                <p className="text-body text-gray-600 mt-1.5">
                    What our customers say about us
                </p>
                <div className="h-0.5 w-12 md:w-24 bg-gray-900 mx-auto mt-2 md:mt-4" />
            </div>

            {/* Reviews Carousel */}
            <div className="relative">
                {/* Navigation Arrows */}
                <button
                    onClick={prevReviews}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    aria-label="Previous reviews"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>

                <button
                    onClick={nextReviews}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    aria-label="Next reviews"
                >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>

                {/* Reviews Grid */}
                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    {(reviewsPerPage === 1 ? reviews : visibleReviews).map((review) => (
                        <div
                            key={review.id}
                            className="min-w-[75vw] md:min-w-0 bg-white border border-gray-200 rounded-lg p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 snap-center"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-3 md:mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-gray-900 text-gray-900" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700 text-[12px] md:text-sm leading-relaxed mb-4 md:mb-4">
                                {review.text}
                            </p>

                            {/* Author */}
                            <p className="text-gray-900 font-bold text-[11px] md:text-sm">
                                _{review.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
