import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const AchievementBadges = () => {
    const user = useSelector((state) => state.auth);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const VISIBLE_LIMIT = 15;

    // Use useCallback to memoize setShowAll function
    const toggleShowAll = useCallback(() => setShowAll(prev => !prev), []);

    useEffect(() => {
        const fetchBadges = async () => {
            if (!user?.userId) {
                setBadges([]);  // If no userId, clear badges
                setLoading(false);
                return;
            }

            try {
                const badgesRef = collection(db, 'users', user.userId, 'badges');
                const snapshot = await getDocs(badgesRef);

                const badgeList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setBadges(badgeList);
            } catch (error) {
                console.error("Error fetching badges:", error);
                setBadges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [user]);

    if (loading) {
        return <p className="text-center text-sm text-gray-400">Loading Achievements and Badges...</p>;
    }

    if (badges.length === 0) {
        return (
            <div className="no-badges">
                <p className="p1">🚫 No Achievements or Badges Yet!</p>
                <p className="p2">Start your journey by creating your first habit and checking it off.</p>
            </div>
        );
    }

    const visibleBadges = showAll ? badges : badges.slice(0, VISIBLE_LIMIT);

    return (
        <div className="badges-container">
            <h2> 🏆 Achievements & Badges</h2>
            <div className="badges-grid">
                {visibleBadges.map((badge) => (
                    <div key={badge.id} className="badge-card">
                        <h3 className="badge-title">
                            {badge.emoji || '🎖️'} {badge.name}
                        </h3>
                        <p className="badge-type">{badge.type || 'Achievement'}</p>
                    </div>
                ))}
            </div>

            {badges.length > VISIBLE_LIMIT && (
                <div className="show-more-container">
                    <button
                        className="show-more-btn"
                        onClick={toggleShowAll}
                    >
                        {showAll ? 'Show Less ▲' : 'Show More ▼'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AchievementBadges;
