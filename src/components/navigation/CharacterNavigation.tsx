'use client';

import React from 'react';
import SideNavigation from './SideNavigation';
import { FaBook, FaCrown, FaUsers, FaDragon, FaFlag } from 'react-icons/fa';

const navigationItems = [
  {
    id: 'race-leaders',
    title: 'Liderler',
    href: '#race-leaders',
    icon: <FaCrown className="text-xl" />
  },
  {
    id: 'legends',
    title: 'Efsaneler',
    href: '#legends',
    icon: <FaBook className="text-xl" />
  },
  {
    id: 'factions',
    title: 'Fraksiyonlar',
    href: '#factions',
    icon: <FaFlag className="text-xl" />
  },
  {
    id: 'faction-members',
    title: 'Fraksiyon Üyeleri',
    href: '#faction-members',
    icon: <FaUsers className="text-xl" />
  },
  {
    id: 'creatures',
    title: 'Yaratıklar',
    href: '#creatures',
    icon: <FaDragon className="text-xl" />
  }
];

const CharacterNavigation = () => {
  return <SideNavigation items={navigationItems} />;
};

export default CharacterNavigation; 