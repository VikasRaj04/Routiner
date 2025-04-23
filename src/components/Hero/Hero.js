import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSlide } from '../../store/slices/HeroCarouselSlice';
import HeroButtons from './HeroButtons';

function Hero() {
  const dispatch = useDispatch();
  const carouselData = useSelector((state) => state.heroCarouselData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('active');
  const [animate, setAnimate] = useState(true);

  const changeSlide = useCallback(() => {
    setTransitionClass('exiting');
    setAnimate(false);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      setCurrentIndex(nextIndex);
      dispatch(setActiveSlide(nextIndex + 1));
      setTransitionClass('entering');
      setAnimate(true);
    }, 800);
  }, [currentIndex, carouselData.length, dispatch]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    dispatch(setActiveSlide(index + 1));
  };

  useEffect(() => {
    const interval = setInterval(changeSlide, 3000);
    return () => clearInterval(interval);
  }, [changeSlide]);

  useEffect(() => {
    setTimeout(() => setTransitionClass('active'), 50);
  }, [currentIndex]);

  const currentSlide = carouselData?.[currentIndex];

  if (!currentSlide) return null; // Avoid crashing if no data

  return (
    <section className='hero'>
      <div className='left'>
        <div className='illus-content'>
          <div className='content'>
            <h1 className={animate ? 'text-transition' : ''}>
              {currentSlide.title}
            </h1>
            <p className={animate ? 'text-transition' : ''}>
              {currentSlide.description}
            </p>
          </div>

          <div className='track-dots'>
            {carouselData.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          <HeroButtons />
        </div>
      </div>

      <div className='right'>
        <div className='concentric-circles'>
          <div className='circle zero'></div>
          <div className='circle one'></div>
          <div className='circle two'></div>
          <div className='circle three'></div>
          <div className='circle four'></div>
          <div className='circle five'></div>
          <div className='circle six'></div>
        </div>

        <div className='mainImg'>
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className={`carousel-image ${transitionClass}`}
          />
        </div>

        {currentSlide.image2 && (
          <div
            className={`secondaryImg ${transitionClass} ${
              currentIndex === 2 ? 'thirdCaro' : ''
            }`}
          >
            <img src={currentSlide.image2} alt='dots' />
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
