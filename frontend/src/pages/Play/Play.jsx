import React from 'react'

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Card, Flex, Image, NavLink, Title } from '@mantine/core'

const Play = () => {
    return (
        <Card sx={{
            width: '540px',
            height: '75%',
            textAlign: 'center',
            backgroundColor: '#262523'
        }}>
            <Flex gap="15px" px="20px" justify='center' align='center' wrap='nowrap' direction='column'>
                <Title order={2} >Play Chess</Title>
                <Image my="md" withPlaceholder width={200} height={120} src={null} />
                {
                    dataList.map((item, index) => <CardItem key={index} label={item.label} description={item.description} src={item.src} to={item.to} />)
                }
            </Flex>
        </Card>
    )
}

const CardItem = ({ label, description, src, to }) => {
    return (
        <NavLink
            component={Link}
            to={to}
            label={label}
            icon={<Image src={src} width={50} />}
            description={description}
            sx={{ backgroundColor: '#1f1f1a', borderRadius: '5px' }}
            p='20px'
        />
    )
}

CardItem.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    src: PropTypes.string,
    to: PropTypes.string
}

const dataList = [
    { label: 'Play Online', description: 'Play vs a person of similar skill', src: 'https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg', to: "/play/online" },
    { label: 'Computer', description: 'Challenge a bot from easy to master', src: 'https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg', to: "/play/computer" },
    { label: 'Play Friend', description: 'Invite a friend to a game of chess', src: 'https://www.chess.com/bundles/web/images/color-icons/handshake.fb30f50b.svg', to: "/play/friend" },
    { label: 'Tournaments', description: 'Join an arena where anyone can win', src: 'https://www.chess.com/bundles/web/images/color-icons/tournaments.6de54f69.svg', to: "/play/tournament" },
]

export default Play