import React, { useEffect } from 'react';
import './styles/Home.css';
import { Navbar, Hero, Features, Footer, About } from '../components';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Features />
            <About />
            <Footer />
        </div>
    )
}

export default Home
