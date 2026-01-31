'use client';

import { useState } from 'react';
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
    const reviewsPerPage = 3;

    const nextReviews = () => {
        setCurrentIndex((prev) =>
            prev + reviewsPerPage >= reviews.length ? 0 : prev + reviewsPerPage
        );
    };

    const prevReviews = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, reviews.length - reviewsPerPage) : Math.max(0, prev - reviewsPerPage)
        );
    };

    const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 uppercase tracking-tight">
                    CUSTOMER REVIEWS
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    What our customers say about us
                </p>
                <div className="h-0.5 w-24 bg-gray-900 mx-auto mt-4" />
            </div>

            {/* Reviews Carousel */}
            <div className="relative">
                {/* Navigation Arrows */}
                <button
                    onClick={prevReviews}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    aria-label="Previous reviews"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>

                <button
                    onClick={nextReviews}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    aria-label="Next reviews"
                >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                {review.text}
                            </p>

                            {/* Author */}
                            <p className="text-gray-900 font-semibold text-sm">
                                _{review.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
