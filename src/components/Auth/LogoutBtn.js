import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
  } catch (error) {
    console.error(error.message);
  }
};

<button onClick={handleLogout}>Logout</button>;
