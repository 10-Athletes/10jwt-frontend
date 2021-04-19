import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Rankings from "./Rankings";
import DropdownProfile from "./templates/DropdownProfile";
import DropdownLogout from "./templates/DropdownLogout";
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

const NB = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return ( 
        <div>
            
        <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/" ><h3> 10 Athletes </h3></NavbarBrand> 
        <NavbarToggler onClick={ toggle }/> 
        <Collapse isOpen = { isOpen } navbar>
            <Nav className="mx-auto" navbar>
                <NavItem>
                    <Button color="link" >
                        <NavLink className="text-light" href="/rankings/">Ranks</NavLink>
                            </Button>
                    </NavItem>
                <NavItem >
                    <Button color="link" >
                        <NavLink className="text-light" href="/profile/" >Profile</NavLink> 
                    </Button>
                </NavItem>
            </Nav>
            <NavLink href="/logout/" className="btn btn-info btn-sm"> Logout </NavLink> 
        </Collapse>
        </Navbar> 
        </div>
    );
};

export default NB;