import dynamic from 'next/dynamic';

export const Header = dynamic<any>(
  () => import('../organisms/Header').then((mod) => mod.Header),
  { ssr: false },
);
export * from './Footer';
export * from './SideMenu';
