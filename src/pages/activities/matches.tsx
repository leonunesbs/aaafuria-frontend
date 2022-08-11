import { ActivityIcon, PageHeading } from '@/components/atoms';
import { Card, Layout } from '@/components/templates';
import {
  Center,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { GetStaticProps } from 'next';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';

interface TeamCardProps {
  name?: string;
  logo?: string;
  opponent?: boolean;
}

interface StatCardProps {
  win: boolean;
  points: number;
  opponentPoints: number;
  extraPoints?: number;
  extraOpponentPoints?: number;
}

interface MatchesProps {
  allMatches: {
    id: string;
    activity: {
      name: string;
    };
    opponent: {
      name: string;
      logo: string;
    };
    tournament: string;
    description: string;
    style: string;
    points: number;
    opponentPoints: number;
    extraPoints: number;
    extraOpponentPoints: number;
    win: boolean;
    status: string;
    scheduleDate: string;
  }[];
}

const TeamCard = ({ name, logo, opponent }: TeamCardProps) => {
  const ctaLogo = useColorModeValue('/logo-cinza.webp', '/logo-branco.webp');
  const calango = useColorModeValue(
    '/calango-verde.png',
    '/calango-verde-b.png',
  );
  return (
    <Stack
      direction={opponent ? 'row-reverse' : 'row'}
      align="center"
      justify={'flex-end'}
      spacing={[1, 2]}
    >
      <Text>{opponent ? name : 'Fúria'}</Text>
      <Image
        src={opponent ? logo || calango : ctaLogo}
        alt={opponent ? name : 'Fúria'}
        objectFit="cover"
        boxSize={'25px'}
      />
    </Stack>
  );
};

const StatCard = ({
  win,
  points,
  opponentPoints,
  extraPoints,
  extraOpponentPoints,
}: StatCardProps) => {
  const green = useColorModeValue('green.500', 'green.200');
  const red = useColorModeValue('red.500', 'red.200');
  return (
    <Center>
      {extraPoints && extraOpponentPoints ? (
        <HStack>
          <Text textColor={win ? green : red}>
            {points} ({extraPoints})
          </Text>
          <Text textAlign={'center'}>:</Text>
          <Text textColor={win ? red : green}>
            ({extraOpponentPoints}) {opponentPoints}
          </Text>
        </HStack>
      ) : (
        <HStack>
          <Text textColor={win ? green : red}>{points}</Text>
          <Text textAlign={'center'}>:</Text>
          <Text textColor={win ? red : green}>{opponentPoints}</Text>
        </HStack>
      )}
    </Center>
  );
};

function Matches({ allMatches }: MatchesProps) {
  return (
    <Layout
      title="Confrontos"
      description="Histórico de confrontos em competições disputadas pela Fúria."
    >
      <PageHeading>Confrontros</PageHeading>
      {allMatches && allMatches.length < 1 && (
        <Text textAlign={'center'} fontStyle="italic">
          Não há confrontos anteriores para serem mostrados.
        </Text>
      )}
      <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
        {allMatches.map(
          (match) =>
            new Date(match.scheduleDate) >= new Date() && (
              <Card key={match.id}>
                <PageHeading size="xs">
                  <ActivityIcon
                    activityName={match.activity.name}
                    size={5}
                    mr={1}
                  />
                  {match.activity.name}
                </PageHeading>
                <Text textAlign={'center'} fontSize="xs">
                  {match.tournament}
                </Text>
                <Text textAlign={'center'} fontSize="xx-small" mb={2}>
                  {match.description} ({match.style})
                </Text>
                <SimpleGrid columns={3} mb={2}>
                  <TeamCard />
                  <StatCard
                    win={match.win}
                    points={match.points}
                    opponentPoints={match.opponentPoints}
                    extraPoints={match.extraPoints}
                    extraOpponentPoints={match.extraOpponentPoints}
                  />
                  <TeamCard
                    opponent
                    name={match.opponent.name}
                    logo={match.opponent.logo}
                  />
                </SimpleGrid>
                <Text
                  textAlign={'center'}
                  fontSize="xx-small"
                  fontStyle={'italic'}
                >
                  {new Date(match.scheduleDate as string).toLocaleString(
                    'pt-BR',
                    {
                      dateStyle: 'long',
                      timeStyle: 'short',
                      timeZone: 'America/Sao_Paulo',
                    },
                  )}
                </Text>
              </Card>
            ),
        )}
      </SimpleGrid>
    </Layout>
  );
}

const GET_MATCHES = gql`
  query getMatches {
    allMatches {
      id
      tournament
      description
      style
      activity {
        name
      }
      opponent {
        name
        logo
      }
      points
      opponentPoints
      extraPoints
      extraOpponentPoints
      status
      scheduleDate
      win
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  return await client
    .query({
      query: GET_MATCHES,
    })
    .then(({ data }) => {
      return {
        props: {
          allMatches: data.allMatches,
        },
        revalidate: 15,
      };
    });
};

export default Matches;
