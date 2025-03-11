import React from "react";
import { NavLink } from "react-router-dom"; 
import { Nav } from "react-bootstrap";
import "./Navbar.css";

const Navbar = () => {
  const navItems = [
    { id: "/categorias", title: "Categorías" },
    { id: "/productos", title: "Productos" },
    
  ];

  return (
    <div className="yamaha-navs-container">
      <Nav className="yamaha-navs justify-content-center">
        {navItems.map((item) => (
          <Nav.Item key={item.id}>
            <NavLink
              to={item.id}
              className={({ isActive }) =>
                isActive ? "nav-link nav-item-active" : "nav-link"
              }
            >
              {item.title}
            </NavLink>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Navbar;
