import {
  Box,
  Circle,
  HStack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';

export interface TicketCirclesProps {
  circleSize: number;
  parentDimensions: any;
}

export function TicketCircles({
  circleSize,
  parentDimensions: dimensions,
}: TicketCirclesProps) {
  const color = useColorModeValue('gray.50', 'gray.999');
  const smallCircleSize = useBreakpointValue([10, 16]);
  const topBottom = useBreakpointValue([`${circleSize / -2}px`]);
  const left = useBreakpointValue([
    `${((dimensions?.borderBox.width as number) - circleSize) / 2}`,
  ]);
  return (
    <Box>
      <Box>
        <HStack
          position={'absolute'}
          top={`${(smallCircleSize as number) / -2}px`}
          left={0}
        >
          {[...Array(10)].map((_, i) => (
            <Circle key={i} size={`${smallCircleSize}px`} bgColor={color} />
          ))}
        </HStack>
        <Circle
          size={`${circleSize}px`}
          bgColor={color}
          position={'absolute'}
          top={topBottom}
          left={left}
        />
        <HStack
          position={'absolute'}
          top={`${(smallCircleSize as number) / -2}px`}
          right={0}
        >
          {[...Array(10)].map((_, i) => (
            <Circle key={i} size={`${smallCircleSize}px`} bgColor={color} />
          ))}
        </HStack>
      </Box>
      <Box>
        <HStack
          position={'absolute'}
          bottom={`${(smallCircleSize as number) / -2}px`}
          left={0}
        >
          {[...Array(10)].map((_, i) => (
            <Circle key={i} size={`${smallCircleSize}px`} bgColor={color} />
          ))}
        </HStack>
        <Circle
          size={`${circleSize}px`}
          bgColor={color}
          position={'absolute'}
          bottom={topBottom}
          left={left}
        />
        <HStack
          position={'absolute'}
          bottom={`${(smallCircleSize as number) / -2}px`}
          right={0}
        >
          {[...Array(10)].map((_, i) => (
            <Circle key={i} size={`${smallCircleSize}px`} bgColor={color} />
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
