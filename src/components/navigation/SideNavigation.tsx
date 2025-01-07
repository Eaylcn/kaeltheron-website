'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SideNavigationProps {
  items: NavigationItem[];
}

const NAVBAR_HEIGHT = 80; // h-20 = 5rem = 80px
const SCROLL_OFFSET = 100;

const SideNavigation: React.FC<SideNavigationProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + NAVBAR_HEIGHT;
    const windowHeight = window.innerHeight;
    const offset = windowHeight * 0.2;

    let found = false;
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        
        if (scrollPosition >= elementTop - offset && scrollPosition < elementTop + rect.height - offset) {
          setActiveId(item.id);
          found = true;
          break;
        }
      }
    }

    // If no section is in view, set active to the last section that's above the viewport
    if (!found) {
      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (scrollPosition >= elementTop) {
            setActiveId(items[i].id);
            break;
          }
        }
      }
    }
  }, [items]);

  useEffect(() => {
    const throttledScroll = () => {
      if (!window.requestAnimationFrame) {
        setTimeout(handleScroll, 66);
        return;
      }
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll);
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (NAVBAR_HEIGHT + SCROLL_OFFSET);

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveId(id);
    }
  };

  return (
    <nav className="fixed left-0 top-20 h-[calc(100vh-5rem)] z-40">
      <div className="sticky top-[20vh] pl-8">
        <div className="flex flex-col space-y-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                activeId === item.id
                  ? 'text-amber-300 font-bold scale-105'
                  : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span className="font-risque text-lg whitespace-nowrap">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation; 