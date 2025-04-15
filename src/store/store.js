import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/DashboardSlice';
import heroCarouselReducer from './slices/HeroCarouselSlice';
import authReducer from './slices/AuthSlice';
import habitReducer from './slices/habitSlice';
import historyReducer from './slices/historySlice';
import progressReducer from './slices/ProgressSlice';
import badgeReducer from './slices/BadgeSlice';

const store = configureStore({
    reducer: {
        heroCarouselData: heroCarouselReducer,
        dashboard: dashboardReducer,
        auth: authReducer,
        habits: habitReducer,
        history: historyReducer,
        progress: progressReducer,
        badge: badgeReducer,
    },
});

export default store;