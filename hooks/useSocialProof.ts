
import { useState, useEffect } from 'react';
import { supabase, Review } from '../utils/supabase/client';

export interface SocialProofData {
    viewers: number;
    reviewCount: number;
    rating: number;
    reviews: Review[];
    isLoading: boolean;
}

export type SocialProofViewersProfile = 'primary' | 'secondary';

export interface SocialProofOptions {
    /**
     * Simulated “viewers” count: primary PDP uses 300 &lt; x &lt; 630, secondary PDP uses 63 &lt; x &lt; 120 (integers).
     * Review baselines still follow `productId` keywords.
     */
    viewersProfile?: SocialProofViewersProfile;
}

/** Uniform random integer x with min &lt; x &lt; max (strict). */
function randomIntStrictBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
}

// Configuration for mock data generation
const MOCK_CONFIG: Record<string, { baseViewers: number; baseReviews: number; baseRating: number }> = {
    // High traffic items
    'default': { baseViewers: 45, baseReviews: 140, baseRating: 4.8 },
    'insole': { baseViewers: 85, baseReviews: 1540, baseRating: 4.9 },
    'bundle': { baseViewers: 110, baseReviews: 2100, baseRating: 5.0 },

    // Low traffic items
    'sock': { baseViewers: 15, baseReviews: 320, baseRating: 4.7 },
    'accessory': { baseViewers: 12, baseReviews: 85, baseRating: 4.6 },
};

export const useSocialProof = (productId: string, options?: SocialProofOptions) => {
    const viewersProfile: SocialProofViewersProfile = options?.viewersProfile ?? 'primary';

    const [data, setData] = useState<SocialProofData>({
        viewers: 0,
        reviewCount: 0,
        rating: 0,
        reviews: [],
        isLoading: true,
    });

    // 1. Determine Mock Baseline based on Product ID keywords
    const getBaseline = (pid: string) => {
        const lowerPid = pid.toLowerCase();
        if (lowerPid.includes('insole')) return MOCK_CONFIG['insole'];
        if (lowerPid.includes('bundle') || lowerPid.includes('kit')) return MOCK_CONFIG['bundle'];
        if (lowerPid.includes('sock')) return MOCK_CONFIG['sock'];
        if (lowerPid.includes('roller') || lowerPid.includes('pad')) return MOCK_CONFIG['accessory'];
        return MOCK_CONFIG['default'];
    };

    const baseline = getBaseline(productId);

    // 2. Real-time "Viewers" simulation
    useEffect(() => {
        const currentViewers =
            viewersProfile === 'secondary'
                ? randomIntStrictBetween(63, 120)
                : randomIntStrictBetween(300, 630);

        setData(prev => ({ ...prev, viewers: currentViewers }));

        // Jitter effect
        const interval = setInterval(() => {
            setData(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                // Keep within reasonable bounds of original start
                const newValue = prev.viewers + change;
                return { ...prev, viewers: newValue };
            });
        }, 4000); // Update every 4s

        return () => clearInterval(interval);
    }, [productId, viewersProfile]);

    // 3. Fetch Real Reviews & Combine with Mock Count
    useEffect(() => {
        let isMounted = true;

        const fetchReviews = async () => {
            // Start with mock data
            const mockCount = baseline.baseReviews;
            const mockRating = baseline.baseRating;

            try {
                if (!supabase) throw new Error("Supabase client not initialized");

                const { data: realReviews, count, error } = await supabase
                    .from('reviews')
                    .select('*', { count: 'exact' })
                    .eq('product_id', productId)
                    .order('created_at', { ascending: false });

                if (!error && isMounted) {
                    // HYBRID CALCULATION
                    // Total = Fake Base + Real DB Count
                    const totalCount = mockCount + (count || 0);

                    // Weighted Average Rating
                    // (MockRating * MockCount + RealRating * RealCount) / Total
                    // For simplicity, if few real reviews, keep Mock Rating dominant
                    // If many real reviews, let them influence it.

                    let finalRating = mockRating;
                    if (realReviews && realReviews.length > 0) {
                        const realSum = realReviews.reduce((acc, r) => acc + r.rating, 0);
                        const realAvg = realSum / realReviews.length;

                        // Weight real reviews slightly higher to make them feel impactful
                        // But don't let 1 bad review tank the 1500 fake ones immediately
                        const weight = Math.min(realReviews.length * 10, mockCount); // Cap influence

                        finalRating = ((mockRating * (mockCount)) + (realAvg * weight)) / (mockCount + weight);
                    }

                    setData(prev => ({
                        ...prev,
                        reviewCount: totalCount,
                        rating: Number(finalRating.toFixed(1)),
                        reviews: realReviews as Review[] || [],
                        isLoading: false
                    }));
                } else {
                    // Fallback to purely mock if DB fails or no keys
                    if (isMounted) {
                        setData(prev => ({
                            ...prev,
                            reviewCount: mockCount,
                            rating: mockRating,
                            reviews: [],
                            isLoading: false
                        }));
                    }
                }
            } catch (err) {
                // Fallback to purely mock
                if (isMounted) {
                    setData(prev => ({
                        ...prev,
                        reviewCount: mockCount,
                        rating: mockRating,
                        reviews: [],
                        isLoading: false
                    }));
                }
            }
        };

        fetchReviews();

        return () => { isMounted = false; };
    }, [productId]);

    return data;
};
