/* eslint-disable react/display-name */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
  Link,
  Icon,
  Image,
  Wrap,
  WrapItem,
  Stack,
  StackItem,
  HStack,
  VStack,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Input,
  NumberInput,
  Radio,
  Select,
  Slider,
  Switch,
  Textarea,
  Badge,
  Kbd,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  useColorMode,
} from '@chakra-ui/react';

const ChakraUIComponents = {
  Box,
  Flex,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
  Link,
  Icon,
  Image,
  Wrap,
  WrapItem,
  Stack,
  StackItem,
  HStack,
  VStack,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Input,
  NumberInput,
  Radio,
  Select,
  Slider,
  Switch,
  Textarea,
  Badge,
  Kbd,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
};

export const UIComponents = {
  h1: (props) => <Heading as="h1" size="2xl" mb={3} {...props} />,
  h2: (props) => <Heading as="h2" size="xl" mb={3} {...props} />,
  h3: (props) => <Heading as="h3" size="lg" mb={3} {...props} />,
  h4: (props) => <Heading as="h4" size="md" mb={3} {...props} />,
  h5: (props) => <Heading as="h5" size="sm" mb={3} {...props} />,
  h6: (props) => <Heading as="h6" size="xs" mb={3} {...props} />,
  p: (props) => <Text as="p" mb={3} {...props} />,
  hr: (props) => <Divider mb={3} {...props} />,
  ul: (props) => <UnorderedList mb={3} {...props} />,
  ol: (props) => <OrderedList mb={3} {...props} />,
  li: (props) => <ListItem mb={3} {...props} />,
  pre: (props) => <div {...props} />,
  code: (props) => {
    const { colorMode } = useColorMode();
    return (
      <SyntaxHighlighter
        mb={3}
        language={
          props.className
            ? props.className.replace('language-', '')
            : 'javascript'
        }
        style={colorMode === 'light' ? vs : darcula}
        {...props}
      />
    );
  },
  blockquote: ({ children, ...restProps }) => (
    <Alert status="info" mb={3} {...restProps}>
      <AlertIcon />
      {children}
    </Alert>
  ),
  // code: CodeBlock,
  ...ChakraUIComponents,
};
