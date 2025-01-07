'use client';

import React from 'react';
import SideNavigation from './SideNavigation';
import { FaHistory, FaFlag, FaSkull } from 'react-icons/fa';

const navigationItems = [
  {
    id: 'history',
    title: 'Geçmiş',
    href: '#history',
    icon: <FaHistory className="text-xl" />
  },
  {
    id: 'current-events',
    title: 'Günümüz',
    href: '#current-events',
    icon: <FaFlag className="text-xl" />
  },
  {
    id: 'future',
    title: 'Gelecek',
    href: '#future',
    icon: <FaSkull className="text-xl" />
  }
];

const StoryNavigation = () => {
  return <SideNavigation items={navigationItems} />;
};

export default StoryNavigation; 