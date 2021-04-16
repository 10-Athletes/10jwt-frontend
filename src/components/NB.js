import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Rankings from "./Rankings";
import DropdownProfile from "./templates/DropdownProfile";
import DropdownLogout from "./templates/DropdownLogout";
import {
  Collapse,
  Navbar,
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
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">10Athletes</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/rankings/">Ranks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/profile/">Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/logout/">Logout</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NB;
