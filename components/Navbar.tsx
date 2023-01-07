

import Link from 'next/link';
import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-link">
        <div className="navbar-brand">
          <p>Hackforms</p>
        </div>
        <div className="navbar-link-container">
        </div>
      </div>
      <div className="navbar-sign">
      <Link className="navlink" href="/login">
              Login
            </Link>
      </div>
      <div className="navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="navbar-menu-container scale-up-center">
            <div className="navbar-menu-container-link">
              <p>
                <Link className="navlink" href="/">
                  Dashboard
                </Link>
              </p>
              <p>
                <Link className="navlink" href="/">
                  About
                </Link>
              </p>
              <p>
                <Link className="navlink" href="/">
                  Contact
                </Link>
              </p>
            </div>
            <div className="navbar-menu-container-link-sign">
              <button type="button">Sign in</button>
              <button type="button">Sign up</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;