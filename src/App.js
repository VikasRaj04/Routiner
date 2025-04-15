import React, { useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "./firebase/firebase";
import { setUser, clearUser } from "./store/slices/AuthSlice";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/NotFound";
import Profile from "./pages/Profile";
import { Login, SignUp, Loader, ForgotPassword } from "./components";
import { setLoading } from "./store/slices/AuthSlice";
import { doc, getDoc } from "firebase/firestore";
import Calendar from "./pages/Calendar";
import History from "./pages/History";
import Progress from "./pages/Progress";

function App() {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth)

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user!");
      return null;
    }
  };


  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userData = await fetchUserData(currentUser.uid);
        dispatch(setUser({ ...currentUser, ...userData }));
      }
      else {
        dispatch(clearUser());
      }

      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      {/* <Navbar/> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;