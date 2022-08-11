import dynamic from 'next/dynamic';

export * from './ActivitiesDashboardCard';
export * from './ActivityCard';
export * from './CartsDashboardCard';
export * from './MembersDashboardCard';
export * from './PaymentsDashboardCard';
export * from './ScheduleCard';
export * from './SejaSocioPricing';

export const ProductCard = dynamic<any>(
  () => import('../molecules/ProductCard').then((mod) => mod.ProductCard),
  { ssr: false },
);
