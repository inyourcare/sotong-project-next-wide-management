import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import { Text, Heading, Box } from "@chakra-ui/react";
import { TMenu } from "@core/types/TMenu";

const MenuDetail: React.FC<{ menu: TMenu }> = ({ menu }) => {
  const creatorId = menu.creatorId
  return (
    <Box
      p={5}
      border="1px solid"
      borderColor="gray.500"
      borderRadius="md"
      onClick={() => Router.push("/menu/[id]", `/menu/${menu.id}`)}
    >
      <Heading size="md">{menu.name}</Heading>
      <Text fontSize="sm">By {creatorId}</Text>
      <ReactMarkdown children={menu.greetings} />
    </Box>
  );
};

export default MenuDetail;
