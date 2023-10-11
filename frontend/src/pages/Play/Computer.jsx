import { Button, Card, Flex, Image, TextInput, Title } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Computer = () => {
  return (
    <Card
      maw={450} sx={{
        width: '100%',
        height: '600px',
        textAlign: 'center',
        backgroundColor: '#262523'
      }}
    >
      <Flex align="center" justify="center" gap="xs" my="lg">
        <Image width="30px" src="https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg" />
        <Title order={2}>Play with Computer</Title>
      </Flex>
      <Flex direction='column' gap='10px'>
        <Link to='/game/computer'>
          <Button color='lime'>
            Play
          </Button>
        </Link>
      </Flex>
    </Card>
  )
}

export default Computer