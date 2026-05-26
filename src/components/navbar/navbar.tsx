'use client';

import { Button } from '@/components/ui/button';
import { IconMenu, IconSearch, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { UserProfile } from './user-profile';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { CartButton } from '../cart/cart-button';
import { CartSheet } from '../cart/cart-sheet';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`app-container fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/80 border-border/50 border-b shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav className={'xs:px-4 app-container sm:px-6'}>
          <div className='flex h-16 items-center justify-between lg:h-20'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2'>
              <motion.span
                className='text-2xl font-bold tracking-tight'
                whileHover={{ scale: 1.02 }}
              >
                LUXE
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden flex-1 justify-center px-6 md:flex'>
              <DesktopNav />
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-2'>
              <Link href='/search' className='cursor-pointer'>
                <Button variant='ghost' size='icon' className='rounded-full'>
                  <IconSearch className='h-5 w-5' />
                  <span className='sr-only'>Search</span>
                </Button>
              </Link>
              <CartButton />
              <UserProfile />
              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full md:hidden'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <IconX className='h-5 w-5' />
                ) : (
                  <IconMenu className='h-5 w-5' />
                )}
                <span className='sr-only'>Menu</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='bg-background/95 border-border border-b backdrop-blur-xl md:hidden'
            >
              <div className='px-4 py-6'>
                <MobileNav onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <CartSheet />
    </>
  );
}
