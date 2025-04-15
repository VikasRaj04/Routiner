import { createSlice } from '@reduxjs/toolkit';
import IllustImage1 from '../../images/Illustration1.png';
import IllustImage2 from '../../images/Illustration2.png';
import IllustImage3 from '../../images/Illustration3.png';
import Dots from '../../images/Dots.png';


// Track your habits, improve productivity, and achieve your goals!


const HeroCarouselSlice = createSlice({
    name: 'HeroCarousel',
    initialState: [
        {
            id: 1,
            title: `Create Good Habits`,
            description: 'Change your life by slowly adding new healthy habits and sticking to them.',
            image: IllustImage1,
            image2: Dots,
        },
        {
            id: 2,
            // title: 'Analyze Your Progress',
            title: 'Track Your Progress',
            // description: 'View reports, streaks, and completion percentages.',
            description: 'Everyday you become one step closer to your goal. Don’t give up!',
            image: IllustImage2,
        },
        {
            id: 3,

            // title: 'Stay Consistent',
            // description: 'Build habits that last with daily progress tracking.',

            title: 'Stay Together and Strong',
            description: 'Find friends to discuss common topics. Complete challenges together.',
            image: IllustImage3,
            image2: Dots,
        },
    ],
    reducers: {
        setActiveSlide: (state, action) => {
            return state.map((slide) =>
                slide.id === action.payload ? { ...slide, active: true } : { ...slide, active: false }
            );
        },
    },

});

export const { setActiveSlide } = HeroCarouselSlice.actions;
export default HeroCarouselSlice.reducer;
