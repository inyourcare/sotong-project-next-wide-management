import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Text, Heading, Box } from "@chakra-ui/react";
import { TMenu } from "@core/types/TMenu";
import { Stack, HStack, VStack } from '@chakra-ui/react'

const MenuDetail: React.FC<{ menu: TMenu }> = ({ menu }) => {
  const creatorId = menu.creatorId
  return (
    <Box
      p={1}
      border="1px solid"
      borderColor="gray.500"
      borderRadius="md"
      onClick={() => Router.push("/menu/[id]", `/menu/${menu.id}`)}
      w="100%"
    >
      <Stack spacing={8} direction='row'>
        <Heading size="md">{menu.name}</Heading>
        <Text fontSize="sm">By {creatorId}</Text>
        <ReactMarkdown children={menu.greetings} />
      </Stack>
    </Box>
  );
};

export default MenuDetail;
