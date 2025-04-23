// Utility to save habits to localStorage
export const saveHabitsToLocal = (userId, habits) => {
  try {
    if (!userId || !Array.isArray(habits)) return;  // Ensure habits is an array
    localStorage.setItem(`habits_${userId}`, JSON.stringify(habits));
  } catch (error) {
    console.error("Error saving habits to localStorage:", error);
  }
};

// Utility to get habits from localStorage
export const getHabitsFromLocal = (userId) => {
  try {
    if (!userId) return [];
    const data = localStorage.getItem(`habits_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading habits from localStorage:", error);
    return [];  // Return empty array on error
  }
};
