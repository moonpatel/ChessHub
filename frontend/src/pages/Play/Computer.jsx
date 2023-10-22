import React from "react";
import { Button, Card, Flex, Image, Select, Text, Title } from "@mantine/core";
import { Form, redirect } from "react-router-dom";

const Computer = () => {
  
  return (
    <Card
      maw={600}
      sx={{
        width: "100%",
        height: "75vh",
        textAlign: "center",
        backgroundColor: "#262523",
      }}
      p={'30px'}
    >
      <Flex align="center" justify="center" gap="xs" my="lg">
        <Image
          width="30px"
          src="https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg"
        />
        <Title order={2}>Play with Computer</Title>
      </Flex>
      <Flex direction="column" gap="10px">
        <Form action={`/play/computer`} method='POST'>
          <Select
            defaultValue="w"
            my="20px"
            color="lime"
            name="color"
            label={
              <Text mx="auto" order={3}>
                Select your color
              </Text>
            }
            placeholder="choose your color"
            data={[
              { value: "w", label: "White" },
              { value: "b", label: "Black" },
            ]}
          />
            <Button color="lime" type="submit">
              Play
            </Button>
        </Form>
      </Flex>
    </Card>
  );
};

export const playComputerAction = async ({request}) => {
  const formData = await request.formData();
  let color = formData.get('color');

  localStorage.setItem('myColor',color);

  return redirect('/game/computer');
}

export default Computer;
