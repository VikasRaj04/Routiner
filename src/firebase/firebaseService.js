import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc, collection, getDocs,
  addDoc,
  serverTimestamp, writeBatch
} from "firebase/firestore";
import { firebaseApp } from "./firebase"; // Firebase config file import karo

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// 1. Get Logged-in User Info & ID
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ✅ Agar koi user already logged in hai, to uska data return karo
        resolve({ uid: user.uid, email: user.email, name: user.displayName || "Guest User" });
      } else {
        // 🔍 Local Storage se Anonymous UID check karo
        let storedUID = localStorage.getItem("anonymousUID");

        if (storedUID) {
          try {
            // 🔥 Firebase se check karo ki ye UID valid hai ya nahi
            const existingUser = auth.currentUser;
            if (existingUser && existingUser.uid === storedUID) {
              resolve({ uid: storedUID, email: null, name: "Guest User" });
              return;
            }
          } catch (error) {
            console.error("Error checking stored anonymous UID:", error);
          }
        }

        // 🆕 Naya Anonymous User Create Karo
        // try {
        //   const cred = await signInAnonymously(auth);
        //   localStorage.setItem("anonymousUID", cred.user.uid); // 🔥 Store UID
        //   resolve({ uid: cred.user.uid, email: null, name: "Guest User" });
        // } catch (error) {
        //   console.error("Error signing in anonymously:", error);
        //   reject("Anonymous login failed");
        // }
      }
    });
  });
};


// 2. Fetch User Habits (Ensure Array Format)
export const fetchHabits = async (userID) => {
  // 🔍 Check if user is anonymous (localStorage me saved UID hai)
  const storedUID = localStorage.getItem("anonymousUID");
  const isAnonymous = userID === storedUID;

  if (isAnonymous) {
    // 🔥 Local Storage se habits fetch karo
    const storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];
    return Array.isArray(storedHabits) ? storedHabits : [];
  } else {
    // 🔥 Firebase se habits fetch karo
    try {
      const snapshot = await getDocs(collection(db, `users/${userID}/habits`));
      let habits = [];

      snapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() });
      });



      return Array.isArray(habits) ? habits : [];
    } catch (error) {
      console.error("Error fetching habits:", error);
      return [];
    }
  }
};

// 3. Add Habit
export const addHabit = async (userID, habitData) => {

  const storedUID = localStorage.getItem("anonymousUID");
  const isAnonymous = userID === storedUID;

  if (isAnonymous) {
    let storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];
    const newHabit = { id: Date.now().toString(), ...habitData };
    storedHabits.push(newHabit);
    localStorage.setItem("anonymousHabits", JSON.stringify(storedHabits));
    return newHabit;
  } else {
    try {
      const newHabitRef = doc(collection(db, `users/${userID}/habits`));
      await setDoc(newHabitRef, habitData);
      const habitId = newHabitRef.id; // Get the actual habit ID from Firestore
      await addHistoryEntry(userID, "Created", habitId, habitData.name); // Ensure habitName is passed properly
      return { id: newHabitRef.id, ...habitData };
    } catch (error) {
      console.error("❌ Error adding habit:", error);
      return null;
    }
  }
};




// 4. Delete Habit
export const deleteHabit = async (userID, habitID, habitName) => {
  try {
    const storedUID = localStorage.getItem("anonymousUID");
    const isAnonymous = userID === storedUID;

    if (isAnonymous) {
      // 🔥 Anonymous User Ke Liye Local Storage Se Habit Delete Karo
      let storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];

      // ✅ Habit ko remove karo
      const updatedHabits = storedHabits.filter(habit => habit.id !== habitID);

      // ✅ Local Storage update karo
      localStorage.setItem("anonymousHabits", JSON.stringify(updatedHabits));

    } else {
      // ✅ Firebase User Ke Liye Database Se Delete Karo
      await deleteDoc(doc(db, `users/${userID}/habits/${habitID}`));
    }

    await addHistoryEntry(userID, "Deleted", habitID, habitName);
    return true;
  } catch (error) {
    console.error("Error deleting habit:", error);
    return false;
  }
};

// 5. Habit Update
export const updateHabit = async (userID, habitID, updatedData, oldData) => {
  const storedUID = localStorage.getItem("anonymousUID");
  const isAnonymous = userID === storedUID;

  if (isAnonymous) {
    // 🔥 Local Storage me update karo
    let storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];
    // Habit ka index dhundho
    const habitIndex = storedHabits.findIndex((habit) => habit.id === habitID);

    if (habitIndex !== -1) {
      // ✅ Habit ko update karo
      storedHabits[habitIndex] = { ...storedHabits[habitIndex], ...updatedData };

      // ✅ Local Storage update karo
      localStorage.setItem("anonymousHabits", JSON.stringify(storedHabits));

      // ✅ UI me turant reflect karne ke liye ek **new array** return karo
      return [...storedHabits];
    } else {
      console.error("Habit not found in localStorage!");
      return null;
    }
  } else {
    // 🔥 Firebase me update karo
    try {
      const habitRef = doc(db, `users/${userID}/habits/${habitID}`);
      await updateDoc(habitRef, updatedData);
      await addHistoryEntry(userID, "updated", habitID, updatedData.name, { old: oldData, new: updatedData });

      // ✅ Firebase se latest data fetch karke return karo
      const updatedHabitDoc = await getDoc(habitRef);
      return { id: habitID, ...updatedHabitDoc.data() };
    } catch (error) {
      console.error("Error updating habit:", error);
      return null;
    }
  }
};






// 6 Function to Add History Entry
export const addHistoryEntry = async (userId, action, habitId, habitName, changes = null) => {
  if (!userId || !habitId || !action || !habitName) {
    console.error("❌ Missing required fields:", { userId, action, habitId, habitName });
    return;
  }

  try {
    const historyRef = collection(db, `users/${userId}/history`);
    await addDoc(historyRef, {
      timestamp: serverTimestamp(),
      action,  // "created", "deleted", "updated", "completed"
      habitId,
      habitName,
      changes: changes || null,  // If updating, changes will have old & new data
    });
  } catch (error) {
    console.error("❌ Error adding history:", error);
  }
};








// 7 Progress Page Functions
export const fetchProgressData = async (userId) => {
  try {
    const progressRef = collection(db, "users", userId, "progress");
    const snapshot = await getDocs(progressRef);

    let progressData = {};
    let allCompleted = 0; // Cumulative completed ticks for all habits
    let allPossible = 0;  // Cumulative possible ticks for all habits

    snapshot.forEach((doc) => {
      const data = doc.data();
      const habitId = doc.id;

      const completion = data.completion || {};
      const habitName = data.habitName || ""; // ✅ Fetch habit name
      const category = data.category || "";
      let totalCompleted = 0;
      let totalPossible = 0;
      let currentStreak = 0;
      let maxStreak = 0;

      const sortedDates = Object.keys(completion).sort();
      let streakOngoing = true;

      sortedDates.forEach((dateStr) => {
        const dayEntry = completion[dateStr];

        if (dayEntry && Array.isArray(dayEntry.ticks)) {
          const ticks = dayEntry.ticks;
          totalPossible += ticks.length;

          const completedCount = ticks.filter(Boolean).length;
          totalCompleted += completedCount;

          if (completedCount === ticks.length) {
            if (streakOngoing) currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            streakOngoing = false;
            currentStreak = 0;
          }
        }
      });

      const averageCompletion = totalPossible ? (totalCompleted / totalPossible) * 100 : 0;

      progressData[habitId] = {
        habitName, // ✅ Include habit name in final object
        completion,
        averageCompletion: Math.round(averageCompletion),
        maxStreak,
        category,
      };

      // Track overall completion data for calculating global completion rates
      allCompleted += totalCompleted;
      allPossible += totalPossible;
    });

    // Calculate daily average completion rate
    const dailyAverageCompletion = allPossible ? (allCompleted / allPossible) * 100 : 0;

    // Calculate all-time average completion rate
    const allTimeCompletionRate = allPossible ? (allCompleted / allPossible) * 100 : 0;

    return {
      progressData,
      dailyAverageCompletion: Math.round(dailyAverageCompletion),
      allTimeCompletionRate: Math.round(allTimeCompletionRate),
    };
  } catch (error) {
    console.error("❌ Error fetching progress data:", error);
    return { progressData: {}, dailyAverageCompletion: 0, allTimeCompletionRate: 0 };
  }
};




// 8 Add Habit Progresss
export const addHabitProgress = async (userId, habitId, date, index, timesPerDay, habitName, category) => {
  try {
    const progressRef = doc(db, "users", userId, "progress", habitId);
    const progressSnap = await getDoc(progressRef);

    let habitData = progressSnap.exists() ? progressSnap.data() : {};
    let timestamp = habitData.timestamp || new Date().toISOString();
    let completion = habitData.completion || {};
    let streaks = habitData.streaks || 0;
    let longestStreak = habitData.longestStreak || 0;
    let totalCompleted = habitData.totalCompleted || 0;
    let totalDaysTracked = habitData.totalDaysTracked || 0;

    // Ensure that completion exists for the current date
    if (!completion[date] || !Array.isArray(completion[date]?.ticks)) {
      completion[date] = {
        ticks: new Array(timesPerDay).fill(false),
        completion: 0
      };
      totalDaysTracked++;
    }

    const dayEntry = completion[date];

    if (index >= 0 && index < timesPerDay) {
      if (!dayEntry.ticks[index]) {
        dayEntry.ticks[index] = true;
        totalCompleted++;
      }
    } else {
      console.error("❌ Invalid index", index);
      return;
    }

    // Calculate daily completion (percentage of ticks completed)
    const completedToday = dayEntry.ticks.filter(Boolean).length;
    dayEntry.completion = (completedToday / timesPerDay) * 100;

    // Calculate overall completion rate based on all days from habit registration to the current date
    const allCompletionData = Object.values(completion);
    const totalTicks = allCompletionData.reduce((acc, day) => acc + day.ticks.length, 0);
    const completedTicks = allCompletionData.reduce((acc, day) => acc + day.ticks.filter(Boolean).length, 0);
    const completionRate = totalTicks > 0 ? (completedTicks / totalTicks) * 100 : 0;

    // Streaks: Check if the current streak is greater than the longest streak
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const prevDateStr = previousDate.toISOString().split("T")[0];

    if (completion[prevDateStr]?.ticks?.every(Boolean)) {
      streaks += 1;
    } else {
      streaks = 1;  // Reset streak on a missed day
    }

    // Update longest streak
    if (streaks > longestStreak) {
      longestStreak = streaks;
    }

    // Save the updated habit data to Firestore
    await setDoc(progressRef, {
      ...habitData,
      habitName,
      category,
      timestamp,
      completion,
      streaks,
      longestStreak,
      totalCompleted,
      totalDaysTracked,
      completionRate,
    }, { merge: true });

    // Update overall global completion rate for all habits (you can update this globally for the user)
    await updateGlobalCompletionRate(userId);

  } catch (error) {
    console.error("❌ Error updating habit progress:", error);
  }
};

// Helper function to update global completion rate (called when a habit progress is added)
const updateGlobalCompletionRate = async (userId) => {
  try {
    const progressRef = collection(db, "users", userId, "progress");
    const snapshot = await getDocs(progressRef);

    let allCompleted = 0;
    let allPossible = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const completion = data.completion || {};
      let totalCompleted = 0;
      let totalPossible = 0;

      Object.keys(completion).forEach((dateStr) => {
        const dayEntry = completion[dateStr];
        if (dayEntry && Array.isArray(dayEntry.ticks)) {
          const ticks = dayEntry.ticks;
          totalPossible += ticks.length;
          const completedCount = ticks.filter(Boolean).length;
          totalCompleted += completedCount;
        }
      });

      allCompleted += totalCompleted;
      allPossible += totalPossible;
    });

    const globalCompletionRate = allPossible ? (allCompleted / allPossible) * 100 : 0;

    // Save this global rate in Firestore under user record
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { globalCompletionRate }, { merge: true });

  } catch (error) {
    console.error("❌ Error updating global completion rate:", error);
  }
};




// 9 Function to delete habit and its progress
export const deleteHabitWithProgress = async (userId, habitId) => {
  try {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    const progressRef = collection(db, "users", userId, "progress");

    // Step 1: Fetch all progress
    const progressSnapshot = await getDocs(progressRef);

    const batch = writeBatch(db);
    const deletedProgress = [];

    progressSnapshot.forEach((docSnap) => {
      const progressDocId = docSnap.id;

      if (progressDocId === habitId) {
        const data = docSnap.data();
        deletedProgress.push({ id: progressDocId, ...data });
        batch.delete(docSnap.ref);
      }
    });


    // Step 2: Archive in `deletedData`
    const deletedRef = doc(db, "users", userId, "deletedData", habitId);
    await setDoc(deletedRef, {
      habitId,
      deletedAt: new Date().toISOString(),
      progress: deletedProgress,
    });

    // Step 3: Commit progress delete
    await batch.commit();

    // Step 4: Delete the habit document
    await deleteDoc(habitRef);

    // Optional: Add history entry (if needed)
    // await addToHistory(userId, habitId, "deleted"); // only if implemented

  } catch (error) {
    console.error("❌ Error deleting habit and its progress:", error);
  }
};





// 10 Calculate and Store Daily Completion Rate
export const calculateAndStoreDailyCompletionRate = async (userId, date) => {
  try {
    const progressRef = collection(db, "users", userId, "progress");
    const snapshot = await getDocs(progressRef);

    let totalCompleted = 0;
    let totalExpected = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const completionArray = data.completion?.[date];

      if (Array.isArray(completionArray)) {
        const completedCount = completionArray.filter(Boolean).length;
        totalCompleted += completedCount;
        totalExpected += completionArray.length;
      }
    });

    const completionRate = totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;

    // ✅ Store result in new subcollection called 'dailyProgress'
    const dailyRef = doc(db, "users", userId, "dailyProgress", date);
    await setDoc(dailyRef, {
      date,
      totalCompleted,
      totalExpected,
      completionRate: parseFloat(completionRate.toFixed(2)),
    });

    console.log(`✅ Daily progress stored for ${date}`);
  } catch (error) {
    console.error("❌ Error calculating daily completion:", error);
  }
};




// 11 ADD NOTE

export const addNoteToDate = async (userId, date, noteText) => {
  const noteData = {
    date: date,
    note: noteText,
    timestamp: new Date(),
  };

  try {
    await addDoc(collection(db, 'users', userId, 'notes'), noteData);
  } catch (err) {
    console.error('Error adding note:', err);
  }
};



// 12 Fetch NOTES DATA

export const fetchNotes = async (userId) => {
  const notesCollection = collection(db, "users", userId, "notes");
  const notesSnapshot = await getDocs(notesCollection);
  const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return notesList;
};




// Modify a note
export const modifyNote = async (userId, noteId, newNoteText) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await updateDoc(noteRef, {
    note: newNoteText,
    lastModified: new Date() // Optional: Track when it was modified
  });
};

// Delete a note
export const deleteNote = async (userId, noteId) => {
  const noteRef = doc(db, "users", userId, "notes", noteId);
  await deleteDoc(noteRef);
};