import dynamic from 'next/dynamic';
import { PostCardProps } from './PostCard';

export const PostCard = dynamic<PostCardProps>(
  () => import('../atoms/PostCard').then((mod) => mod.PostCard),
  { ssr: false },
);

export * from './ActivityIcon';
export * from './Analytics';
export * from './CartsTable';
export * from './ColorModeToggle';
export * from './CustomButton';
export * from './CustomDivider';
export * from './CustomIconButton';
export * from './CustomLink';
export * from './DefaultColumnFilter';
export * from './Fonts';
export * from './HeaderImage';
export * from './MembersTable';
export * from './ObjectColumnFilter';
export * from './PageHeading';
export * from './PaymentInstructions';
export * from './PaymentMethods';
export * from './PaymentsTable';
export * from './PostCard';
export * from './PostListItem';
export * from './PreviousButton';
export * from './PriceTag';
export * from './QuantitySelector';
export * from './SelectColumnFilter';
export * from './SocialIcons';
export * from './TicketCircles';
