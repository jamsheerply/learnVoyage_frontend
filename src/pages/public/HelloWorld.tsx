import { Button, Stack } from "@chakra-ui/react";
import React from "react";
import { useSearchParams } from "react-router-dom";

function HelloWorld() {
  const [searchParams] = useSearchParams();
  const data = searchParams.get("data");
  console.log(data);
  return (
    <Stack spacing={4} direction="row" align="center">
      <Button colorScheme="teal" size="xs">
        Button
      </Button>
      <Button colorScheme="teal" size="sm">
        Button
      </Button>
      <Button colorScheme="teal" size="md">
        Button
      </Button>
      <Button colorScheme="teal" size="lg">
        Button
      </Button>
    </Stack>
  );
}

export default HelloWorld;
