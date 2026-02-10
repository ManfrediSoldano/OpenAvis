import React, { useEffect, useRef, useState } from 'react';
import StaggeredMenu from '../reactbits/StaggeredMenu';
import './Header.css';

const menuItems = [
  { label: 'Iscriviti', link: '/' },
  { label: 'Chi Siamo', link: '/storia' },
  { label: 'Convenzioni', link: '/convenzioni' },
  { label: 'Sospensione', link: '/sospensione' }
];

const socialItems = [
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

const Header: React.FC = () => {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#333333"
        changeMenuColorOnOpen={true}
        colors={['#f8f9fa', '#e9ecef']}
        logoUrl="/images/Logo_AVIS.svg"
        accentColor="#0075be"
      />
    </>
  );
};

export default Header;