'use client';

import React, { useState, useEffect } from 'react';
import { StoryHeroSection } from '@/components/story/StoryHeroSection';
import Timeline from '@/components/story/Timeline';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TimelineData {
  timeline: any[]; // Replace 'any' with proper type when available
}

export default function StoryPage() {
  const [timelineData, setTimelineData] = useState<TimelineData['timeline']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimelineData() {
      try {
        const response = await fetch('/api/story');
        const data: TimelineData = await response.json();
        setTimelineData(data.timeline || []);
      } catch (error) {
        console.error('Failed to fetch story data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimelineData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-[#0B1120]">
      <StoryHeroSection />
      <section className="relative">
        <Timeline data={timelineData} />
      </section>
    </main>
  );
} 