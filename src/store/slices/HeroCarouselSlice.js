import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  {
    id: 1,
    title: 'Create Good Habits',
    description: 'Change your life by slowly adding new healthy habits and sticking to them.',
    image: '/images/Illustration1.png',
    image2: '/images/Dots.png',
    active: false,
  },
  {
    id: 2,
    title: 'Track Your Progress',
    description: 'Every day you become one step closer to your goal. Don’t give up!',
    image: '/images/Illustration2.png',
    active: false,
  },
  {
    id: 3,
    title: 'Stay Together and Strong',
    description: 'Find friends to discuss common topics. Complete challenges together.',
    image: '/images/Illustration3.png',
    image2: '/images/Dots.png',
    active: false,
  },
];

const heroCarouselSlice = createSlice({
  name: 'heroCarousel',
  initialState,
  reducers: {
    setActiveSlide: (state, action) => {
      return state.map(slide => ({
        ...slide,
        active: slide.id === action.payload,
      }));
    },
  },
});

export const { setActiveSlide } = heroCarouselSlice.actions;
export default heroCarouselSlice.reducer;
