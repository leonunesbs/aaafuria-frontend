import { Icon, IconProps } from '@chakra-ui/react';
import {
  MdSportsBasketball,
  MdSportsHandball,
  MdSportsSoccer,
  MdSportsTennis,
  MdSportsVolleyball,
} from 'react-icons/md';

import { BiSwim } from 'react-icons/bi';
import { ColorContext } from '@/contexts/ColorContext';
import { FaDrum } from 'react-icons/fa';
import { GiPokerHand } from 'react-icons/gi';
import { RiBilliardsFill } from 'react-icons/ri';
import { useContext } from 'react';

export interface ActivityIconProps extends IconProps {
  activityName: string;
  size?: string | number | string[] | number[];
}

export function ActivityIcon({
  activityName,
  size = '10',
  ...rest
}: ActivityIconProps) {
  const { green } = useContext(ColorContext);
  switch (activityName.toLowerCase()) {
    case 'futsal':
      return (
        <Icon as={MdSportsSoccer} w={size} h={size} color={green} {...rest} />
      );
    case 'carabina':
      return <Icon as={FaDrum} w={size} h={size} color={green} {...rest} />;
    case 'society':
      return (
        <Icon as={MdSportsSoccer} w={size} h={size} color={green} {...rest} />
      );
    case 'basquete':
      return (
        <Icon
          as={MdSportsBasketball}
          w={size}
          h={size}
          color={green}
          {...rest}
        />
      );
    case 'handebol':
      return (
        <Icon as={MdSportsHandball} w={size} h={size} color={green} {...rest} />
      );
    case 'vôlei':
      return (
        <Icon
          as={MdSportsVolleyball}
          w={size}
          h={size}
          color={green}
          {...rest}
        />
      );
    case 'tênis de mesa':
      return (
        <Icon as={MdSportsTennis} w={size} h={size} color={green} {...rest} />
      );
    case 'poker':
      return (
        <Icon as={GiPokerHand} w={size} h={size} color={green} {...rest} />
      );
    case 'truco':
      return (
        <Icon as={GiPokerHand} w={size} h={size} color={green} {...rest} />
      );
    case 'natação':
      return <Icon as={BiSwim} w={size} h={size} color={green} {...rest} />;
    case 'sinuca':
      return (
        <Icon as={RiBilliardsFill} w={size} h={size} color={green} {...rest} />
      );
    default:
      return <></>;
  }
}
