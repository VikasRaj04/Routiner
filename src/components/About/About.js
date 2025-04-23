import React, { Suspense, lazy } from 'react';
// import './About.css';

// Optimized image import at the top as well
import AboutIllustration from '../../images/AboutIllust1.webp';

// Lazy-loaded components at the top for correct import order
const ShortStory = lazy(() => import('./ShortStory'));
const KeyFeatures = lazy(() => import('./KeyFeatures'));

const About = () => {
    return (
        <section className="about-section" id='about'>
            <div className="about-content">
                <div className="left">
                    <div className="about-graphics">
                        <img src={AboutIllustration} alt="Illustration showcasing Routiner app features" />
                    </div>

                    <div className="left-text-container">
                        <div className="left-text">
                            <article className="story">
                                <Suspense fallback={<div>Loading story...</div>}>
                                    <ShortStory />
                                </Suspense>
                            </article>
                        </div>
                    </div>
                </div>

                <div className="right">
                    <h2 className='about-heading'>About Routiner</h2>
                    <div className="purpose">
                        <p>
                            Routiner exists to help individuals track their daily progress, stay motivated, and achieve their goals. Created to bridge the gap left by expensive or feature-limited apps, Routiner offers a simple yet comprehensive platform. Whether it's tracking habits, learning, or personal growth, Routiner empowers users to consistently improve and succeed in their daily routines.
                        </p>
                    </div>

                    <div className="mission">
                        <h3>Our Mission</h3>
                        <p>
                            Our mission is to provide a user-friendly and feature-rich platform that simplifies habit tracking, motivates users to stay consistent, and helps them achieve their personal and professional goals with ease.
                        </p>
                    </div>

                    <Suspense fallback={<div>Loading Key Features...</div>}>
                        <KeyFeatures />
                    </Suspense>

                    <div className="why-choose-us">
                        <h3>Why Choose Us?</h3>
                        <ul>
                            <li>
                                <span className='bold-underline'>Simplicity:</span> Easy-to-use interface for all age groups.
                            </li>
                            <li>
                                <span className='bold-underline'>Customization:</span> Tailor your habits, reports, and reminders to fit your needs.
                            </li>
                            <li>
                                <span className='bold-underline'>Detailed Insights:</span> Gain in-depth progress analytics and performance reports.
                            </li>
                            <li>
                                <span className='bold-underline'>Flexibility:</span> Access habit data via calendar, list, or detailed views.
                            </li>
                            <li>
                                <span className='bold-underline'>Future Features:</span> Unique features like social sharing and public posts are on the way!
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
