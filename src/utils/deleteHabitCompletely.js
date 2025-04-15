import { doc, deleteDoc, collection, getDocs, writeBatch, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { addHistoryEntry } from "../firebase/firebaseService";
import { removeHabit } from "../store/slices/habitSlice";

export const deleteHabitCompletely = async (userID, habitID, habitName, dispatch) => {
  try {
    const storedUID = localStorage.getItem("anonymousUID");
    const isAnonymous = userID === storedUID;

    if (isAnonymous) {
      // 🔥 Anonymous user: LocalStorage se remove karo
      let storedHabits = JSON.parse(localStorage.getItem("anonymousHabits")) || [];
      const updatedHabits = storedHabits.filter(habit => habit.id !== habitID);
      localStorage.setItem("anonymousHabits", JSON.stringify(updatedHabits));

      console.log(`Anonymous habit deleted: ${habitName}`);
    } else {
      const habitRef = doc(db, "users", userID, "habits", habitID);
      const progressRef = collection(db, "users", userID, "progress");

      // 🔍 Fetch all progress linked to this habit
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

      // 🗃️ Archive deleted habit + progress
      const archiveRef = doc(db, "users", userID, "deletedData", habitID);
      await setDoc(archiveRef, {
        habitId: habitID,
        deletedAt: new Date().toISOString(),
        progress: deletedProgress,
      });

      // ✅ Commit batched progress deletes
      await batch.commit();

      // ✅ Now delete habit document
      await deleteDoc(habitRef);

      console.log(`✅ Deleted habit "${habitName}" and related progress`);
    }

    // 🔄 Update Redux Store
    dispatch(removeHabit({ userID, habitID, habitName }));

    // 🕘 History Entry
    await addHistoryEntry(userID, "deleted", habitID, habitName);

    return true;
  } catch (error) {
    console.error("❌ Error in deleteHabitCompletely:", error);
    return false;
  }
};
