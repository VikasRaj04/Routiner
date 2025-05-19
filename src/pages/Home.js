import React from 'react';
import './styles/Home.css';
import { Navbar, Hero, Features, Footer, About } from '../components';

function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <div className="ad">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
                    crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-ef+6k-30-ac+ty"
                    data-ad-client="ca-pub-3405064387458435"
                    data-ad-slot="5877457995"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
            <Features />
            <div className="ad">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
                    crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-ef+6k-30-ac+ty"
                    data-ad-client="ca-pub-3405064387458435"
                    data-ad-slot="5877457995"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
            <About />
            <div className="ad">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
                    crossorigin="anonymous"></script>
                <ins class="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-ef+6k-30-ac+ty"
                    data-ad-client="ca-pub-3405064387458435"
                    data-ad-slot="5877457995"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
            <Footer />
        </div>
    )
}

export default Home
