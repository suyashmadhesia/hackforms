import React from 'react';
import graphic from '../assets/homepic.svg';
// import homeStyle from './Home.module.css'
import Image from 'next/image';

const Home = () => {
  return (
    <div className="container">
      <div className="mainBox">
        <div className="heading">
          <h1>HACK FORM</h1>
          <h5>Decentralized alternative of Google Forms and Swagbucks</h5>
        </div>
        <div className="homepic">
          <Image src={graphic} alt="form graphic" className="formGraphic" />
        </div>
      </div>
    </div>
  );
};

export default Home;