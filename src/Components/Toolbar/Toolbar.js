import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classes from './Toolbar.module.css';

const Toolbar = (props) => {
    return (
        <Navbar expand="lg" variant="light">
            <Navbar.Brand>Aplikace</Navbar.Brand>
            <Link to={'/'}> Home </Link>
            <Link to={'/login'}> Login </Link>
            <Link to={'/about'}> About </Link>
        </Navbar>
    )

}

export default Toolbar;