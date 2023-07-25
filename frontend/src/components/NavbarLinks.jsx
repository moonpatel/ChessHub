import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { NavLink, Text, ThemeIcon } from '@mantine/core'
import { GearIcon, HomeIcon, PlayIcon } from '@radix-ui/react-icons'

const NavbarLinks = () => {
    const [active, setActive] = useState(null);
    const links = linksList.map((link, index) => <NavbarLink key={index} label={link.label} icon={link.icon} to={link.to} index={index} active={active} setActive={setActive} />)
    return (
        <div>{links}</div>
    )
}

const NavbarLink = ({ label, icon, to, index, active, setActive }) => {
    return (
        <NavLink
            sx={(theme) => ({
                width: '100%',
                padding: theme.spacing.xs,
                // borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            })}
            active={active === index}
            onClick={() => setActive(index)}
            component={Link}
            to={to}
            icon={
                <ThemeIcon variant="filled" color={active === index ? 'gray' : 'lime'}>
                    {icon}
                </ThemeIcon>
            }
            label={
                <Text size="sm">{label}</Text>
            }
            color='lime'
            variant='filled'
        >
        </NavLink>
    )
}

NavbarLink.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.object,
    to: PropTypes.string,
    index: PropTypes.number,
    active: PropTypes.number,
    setActive: PropTypes.func
}

const linksList = [
    { label: 'Home', icon: <HomeIcon />, to: "/home" },
    { label: 'Play Chess', icon: <PlayIcon />, to: "/play" },
    { label: 'Settings', icon: <GearIcon />, to: "/settings" },
]

export default NavbarLinks