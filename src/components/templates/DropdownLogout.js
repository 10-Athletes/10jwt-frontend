import React from "react";
import { DropdownItem } from "reactstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default (props) => {
  return (
    <DropdownItem>
      <Link href="logout/">Logout</Link>
    </DropdownItem>
  );
};
