
"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

const FooterLink: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => (
    <li>
        <Link href={href} className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors text-sm">
            {children}
        </Link>
    </li>
);

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface dark:bg-dark-surface border-t border-border dark:border-dark-border mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-primary-text dark:text-dark-primary-text mb-4">{t('categories')}</h4>
            <ul className="space-y-2">
              <FooterLink href="/?category=prem-shayari">प्रेम शायरी</FooterLink>
              <FooterLink href="/?category=dukh-shayari">दुख शायरी</FooterLink>
              <FooterLink href="/?category=motivational-shayari">मोटिवेशनल शायरी</FooterLink>
              <FooterLink href="/?category=dosti-shayari">दोस्ती शायरी</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-text dark:text-dark-primary-text mb-4">{t('authors')}</h4>
            <ul className="space-y-2">
              <FooterLink href="/authors">राहुल शर्मा</FooterLink>
              <FooterLink href="/authors">प्रिया गुप्ता</FooterLink>
              <FooterLink href="/authors">अमित कुमार</FooterLink>
              <FooterLink href="/authors">सुनीता देवी</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-text dark:text-dark-primary-text mb-4">{t('about')}</h4>
            <ul className="space-y-2">
              <FooterLink href="/about">{t('about')}</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-text dark:text-dark-primary-text mb-4">Follow Us</h4>
             <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors text-sm">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors text-sm">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors text-sm">Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-secondary-text dark:text-dark-secondary-text hover:text-primary dark:hover:text-dark-primary transition-colors text-sm">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border dark:border-dark-border text-center">
          <p className="text-sm text-secondary-text dark:text-dark-secondary-text">
            © {new Date().getFullYear()} {t('shayariBlogTitle')}. All rights reserved.
          </p>
           <p className="text-xs text-secondary-text/80 dark:text-dark-secondary-text/80 mt-1">
            Contact: info@shayariblog.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
