import React, {useContext} from 'react'
import { Container, Navbar as NavbarComp, Nav, NavDropdown } from 'react-bootstrap'
import {
    Link,
    useNavigate
} from "react-router-dom"

import { UserContext } from '../context/userContext'

// import ImgDumbMerch from '../assets/DumbMerch.png'
import Logo from '../assets/Logo.png'

export default function Navbar(props) {
    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/auth")
    }

    return (
        <NavbarComp expand="lg">
            <Container>
                <NavbarComp.Brand as={Link} to="/">
                    <img src={Logo} className="img-fluid" style={{ width: '200px', height: '80px' }} />
                </NavbarComp.Brand>
                <NavbarComp.Toggle aria-controls="basic-navbar-nav" />
                <NavbarComp.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/profile" className={props?.title == 'Profile' ? `text-navbar-active` : `text-navbar`}>Profile</Nav.Link>
                        <Nav.Link onClick={logout} className="text-navbar">Logout</Nav.Link>
                    </Nav>
                </NavbarComp.Collapse>
            </Container>
        </NavbarComp>
    )
}
