// components/Features.js

import React from 'react';
import FeatureCard from './FeatureCard';

const featuresData = [
  {
    id: 'f1',
    icon: '📆',
    title: 'Daily Habit Tracking',
    description:
      'Easily monitor your habits every day with an interactive calendar view and quick updates.',
  },
  {
    id: 'f2',
    icon: '📊',
    title: 'Progress Reports',
    description:
      'Get detailed progress reports with streaks, completion rates, and performance graphs.',
  },
  {
    id: 'f3',
    icon: '🔔',
    title: 'Custom Reminders',
    description:
      'Set personalized reminders to keep you on track and never miss a habit update.',
  },
  {
    id: 'f4',
    icon: '📝',
    title: 'Habit Categories',
    description:
      'Organize your habits into categories like health, productivity, learning, and more.',
  },
  {
    id: 'f5',
    icon: '📜',
    title: 'Detailed History',
    description:
      'Access a complete history of your habits, including missed days and achievements.',
  },
  {
    id: 'f6',
    icon: '👤',
    title: 'User Profiles',
    description:
      'Login to create, save, and access your habits across devices with personalized settings.',
  },
];

const Features = () => (
  <section className="features-section" aria-labelledby="features-heading">
    <h2 id="features-heading" className="features-section__heading">
      Features
    </h2>
    <div className="features-section__cards">
      {featuresData.map(({ id, icon, title, description }) => (
        <FeatureCard
          key={id}
          icon={icon}
          title={title}
          description={description}
        />
      ))}
    </div>
  </section>
);

export default Features;
