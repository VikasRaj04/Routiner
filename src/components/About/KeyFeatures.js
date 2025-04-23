import React, { useState } from 'react';

const KeyFeatures = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const features = [
        {
            id: 1,
            title: "Habit Tracking Made Simple",
            content: "Easily add, manage, and update your daily habits with an intuitive interface designed for seamless tracking."
        },
        {
            id: 2,
            title: "Detailed Progress Reports",
            content: "Visualize your growth with detailed reports, including streaks, completion rates, and overall progress analysis."
        },
        {
            id: 3,
            title: "Customizable Reminders",
            content: "Stay consistent with fully customizable reminders, ensuring you never miss an update or task."
        },
        {
            id: 4,
            title: "Flexible Viewing Options",
            content: "Access your habit data through calendar views, list views, and progress charts tailored to your preferences."
        },
        {
            id: 5,
            title: "Comprehensive History Tracking",
            content: "Track your journey with a complete history of habits—daily, weekly, monthly, and overall."
        },
        {
            id: 6,
            title: "Categorized Habits",
            content: "Organize your habits into categories like health, productivity, and more for better clarity and focus."
        },
        {
            id: 7,
            title: "Advanced Reports and Analytics",
            content: "Get deeper insights into your performance with analytics to improve consistency and productivity."
        },
        {
            id: 8,
            title: "Future-Ready Features (Coming Soon)",
            content: (
                <ul>
                    <li><span className='bold-underline'>Social Integration:</span> Connect with friends, share your habits, and motivate each other.</li>
                    <li><span className='bold-underline'>Public Posts:</span> Share your habit journeys and success stories with the Routiner community.</li>
                </ul>
            ),
        },
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="key-features">
            <h3>Key Features of Routiner</h3>

            <div className="features">
                {features.map((feature, index) => (
                    <div key={feature.id} className="accordion-item">
                        <h4 className="accordion-header" onClick={() => toggleAccordion(index)}>
                            {feature.title}
                            <span className={`accordion-icon ${activeIndex === index ? "rotate" : ""}`}>
                                <i className="fa-solid fa-angle-down"></i>
                            </span>
                        </h4>

                        <div className={`accordion-content ${activeIndex === index ? "open" : ""}`}>
                            {activeIndex === index && <p>{feature.content}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default KeyFeatures;
