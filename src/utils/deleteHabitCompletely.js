import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { addHistoryEntry } from "../firebase/firebaseService";
import { removeHabit } from "../store/slices/habitSlice";

export const deleteHabitCompletely = async (userID, habitID, habitName, dispatch) => {
  try {
    const storedUID = localStorage.getItem("anonymousUID");
    const isAnonymous = userID === storedUID;

    if (isAnonymous) {
      // 🔥 Anonymous user: Delete from localStorage
      const storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];
      const updatedHabits = storedHabits.filter(habit => habit.id !== habitID);
      localStorage.setItem("anonymousHabits", JSON.stringify(updatedHabits));

      console.log(`🗑️ Deleted anonymous habit: ${habitName}`);
    } else {
      const habitRef = doc(db, "users", userID, "habits", habitID);
      const progressRef = collection(db, "users", userID, "progress");

      const progressSnapshot = await getDocs(progressRef);
      const batch = writeBatch(db);
      const deletedProgress = [];

      progressSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.habitId === habitID) {
          deletedProgress.push({ id: docSnap.id, ...data });
          batch.delete(docSnap.ref);
        }
      });

      // 📦 Archive deleted habit + its progress
      await setDoc(doc(db, "users", userID, "deletedData", habitID), {
        habitId: habitID,
        deletedAt: new Date().toISOString(),
        progress: deletedProgress,
      });

      await batch.commit();        // 🚮 Delete all related progress
      await deleteDoc(habitRef);   // 🗑️ Delete the habit document

      console.log(`✅ Deleted habit "${habitName}" and related progress`);
    }

    // 🔄 Update Redux
    dispatch(removeHabit({ userID, habitID, habitName }));

    // 🕘 Log to history
    await addHistoryEntry(userID, "deleted", habitID, habitName);

    return true;
  } catch (error) {
    console.error("❌ Failed to delete habit:", error.message);
    return false;
  }
};
