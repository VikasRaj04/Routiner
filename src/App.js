import React, { useEffect, lazy, Suspense } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "./firebase/firebase";
import { setUser, clearUser, setLoading } from "./store/slices/AuthSlice";
import { doc, getDoc } from "firebase/firestore";

// Components
import { Login, SignUp, Loader, ForgotPassword } from "./components";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import { sanitizeFirebaseUser } from "./utils/sanitizeFirebaseUser";

// Lazy-loaded Pages with Preload
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Progress = lazy(() => import("./pages/Progress"));
const History = lazy(() => import("./pages/History"));
const Calendar = lazy(() => import("./pages/Calendar"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userData = await fetchUserData(currentUser.uid);
        dispatch(setUser(sanitizeFirebaseUser(currentUser, userData)));
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Preload components for better navigation performance
  useEffect(() => {
    const preLoadDashboard = () => import("./pages/Dashboard");
    const preLoadProgress = () => import("./pages/Progress");
    const preLoadHistory = () => import("./pages/History");
    const preLoadCalendar = () => import("./pages/Calendar");
    const preLoadPrivacyPolicy = () => import("./pages/PrivacyPolicy");

    preLoadDashboard();
    preLoadProgress();
    preLoadHistory();
    preLoadCalendar();
    preLoadPrivacyPolicy();
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/history" element={<History />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
