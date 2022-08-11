import dynamic from 'next/dynamic';

export const Header = dynamic<any>(
  () => import('../organisms/Header').then((mod) => mod.Header),
  { ssr: false },
);
export * from './AddMembershipDrawer';
export * from './AddPaymentDrawer';
export * from './AddScheduleDrawer';
export * from './Footer';
export * from './ManageScheduleDrawer';
export * from './SideMenu';
export * from './SignUpDrawer';
