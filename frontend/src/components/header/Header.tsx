import React, { useEffect, useRef, useState } from 'react';
import StaggeredMenu from '../reactbits/StaggeredMenu';
import './Header.css';

const menuItems = [
  { label: 'Diventa Donatore', link: '/diventa-donatore' },
  { label: 'Chi Siamo', link: '/storia' },
  { label: 'Convenzioni', link: '/convenzioni' },
  { label: 'Notizie', link: '/news' }
];

const socialItems = [
  { label: 'Facebook', link: '#' }
];

const Header: React.FC = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    // Check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch('/.auth/me');
        const data = await res.json();
        if (data.clientPrincipal) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Auth check failed in header", e);
      }
    };
    checkAuth();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [...menuItems];
  if (isLoggedIn) {
    items.push({ label: 'Dashboard', link: '/reserved' });
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${isSticky ? ' is-sticky' : ''}`}
      >
        <div className="header-content"></div>
      </header>
      <StaggeredMenu
        position="right"
        items={items}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#333333"
        changeMenuColorOnOpen={true}
        colors={['#f8f9fa', '#e9ecef']}
        logoUrl="https://openavismeratestorage.blob.core.windows.net/public-assets/Logo_AVIS_Merate_bianco.png"
        accentColor="#0075be"
      />
    </>
  );
};

export default Header;