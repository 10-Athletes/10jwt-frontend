import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
    Collapse,
    Navbar,
    Button,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from "reactstrap";
let jwt = window.localStorage.getItem('jwt');
function handleLogout() {
        if (jwt) {
            window.localStorage.removeItem('jwt')
            this.props.history.push('/register')
        } else {
            window.alert('No JWT!')

        }
  }
const NB = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return ( 
        <div>
            
        <Navbar color="dark" dark expand="md" style={{width:'100%'}}>
            <NavbarBrand href="/" ><h3> 10 Athletes </h3></NavbarBrand> 
        <NavbarToggler onClick={ toggle }/> 
        <Collapse isOpen = { isOpen } navbar>
            <Nav className="mx-auto" navbar>
                <NavItem>
                    <Button color="link" >
                        <NavLink className="text-light" href="/rankings/">Rankings</NavLink>
                            </Button>
                    </NavItem>
                <NavItem >
                    <Button color="link" >
                        <NavLink className="text-light" href="/profile/" >Profile</NavLink> 
                    </Button>
                </NavItem>
            </Nav>
            <NavLink href="/register/" onclick={handleLogout} className="btn btn-info btn-sm"> Logout </NavLink> 
        </Collapse>
        </Navbar> 
        </div>
    );
};

export default NB