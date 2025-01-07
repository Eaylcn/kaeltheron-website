'use client';

import React from 'react';
import SideNavigation from './SideNavigation';
import { FaMapMarkedAlt, FaMountain } from 'react-icons/fa';

const navigationItems = [
  {
    id: 'map',
    title: 'Harita',
    href: '#map',
    icon: <FaMapMarkedAlt className="text-xl" />
  },
  {
    id: 'geography',
    title: 'Coğrafya',
    href: '#geography',
    icon: <FaMountain className="text-xl" />
  }
];

const GeographyNavigation = () => {
  return <SideNavigation items={navigationItems} />;
};

export default GeographyNavigation; 