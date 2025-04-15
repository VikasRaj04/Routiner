import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSlide } from '../../store/slices/HeroCarouselSlice';
import './Hero.css';
import HeroButtons from './HeroButtons';

function Hero() {

  const dispatch = useDispatch();
  const carouselData = useSelector(state => state.heroCarouselData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState("active");
  const [animate, setAnimate] = useState(true);


  // Function to change slide (Automatic)
  const changeSlide = () => {
    setTransitionClass("exiting");
    setAnimate(false);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      setCurrentIndex(nextIndex);
      dispatch(setActiveSlide(nextIndex + 1));
      setTransitionClass("entering");
      setAnimate(true);
    }, 800);
  };

  // Function to go to specific slide when button is clicked
  const goToSlide = (index) => {
    setCurrentIndex(index);
    dispatch(setActiveSlide(index + 1));
  };

  useEffect(() => {
    const interval = setInterval(changeSlide, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    setTimeout(() => setTransitionClass("active"), 50); // Smooth entry for first render
  }, [currentIndex]);


  return (

    <section className='hero'>
      <div className="left">
        <div className="illus-content">
          <div className="content">
            <h1 className={animate ? 'text-transition' : ''}>
              {carouselData[currentIndex].title}
            </h1>
            <p className={animate ? 'text-transition' : ''}>
              {carouselData[currentIndex].description}
            </p>
          </div>


          <div className="track-dots">
            {carouselData.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(index);
                  dispatch(setActiveSlide(index + 1));
                }}
              />
            ))}
          </div>

          {/* HeroButtons Styles => Hero.css */}
          <HeroButtons />

        </div>
      </div>

      <div className="right">
        <div className="concentric-circles">
          <div className="circle zero"></div>
          <div className="circle one"></div>
          <div className="circle two"></div>
          <div className="circle three"></div>
          <div className="circle four"></div>
          <div className="circle five"></div>
          <div className="circle six"></div>
        </div>

        <div className="mainImg">
          <img
            src={carouselData[currentIndex].image}
            alt={carouselData[currentIndex].title}
            className={`carousel-image ${transitionClass}`}
          />
        </div>

        {carouselData[currentIndex].image2 && (
          <div
            className={`secondaryImg ${transitionClass} ${currentIndex === 2 ? "thirdCaro" : ""}`}
          >
            <img src={carouselData[currentIndex].image2} alt="dots" />
          </div>
        )
        }
      </div>

    </section>
  )
}

export default Hero

