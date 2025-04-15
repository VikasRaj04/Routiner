// utils/localStorage.js
// export const saveToLocalStorage = (key, value) => {
//     localStorage.setItem(key, JSON.stringify(value));
//   };

//   export const loadFromLocalStorage = (key) => {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : null;
//   };


export const saveHabitsToLocal = (userId, habits) => {
  if (!userId) return;
  localStorage.setItem(`habits_${userId}`, JSON.stringify(habits));
};

export const getHabitsFromLocal = (userId) => {
  if (!userId) return [];
  const data = localStorage.getItem(`habits_${userId}`);
  return data ? JSON.parse(data) : [];
};
