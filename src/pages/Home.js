import React from 'react';
import './styles/Home.css';
import { Navbar, Hero, Features, Footer, About } from '../components';

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
