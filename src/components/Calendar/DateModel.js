import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, makeUseVisualState } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgress, selectProgressData } from "../../store/slices/ProgressSlice";
import { fetchUserHabits } from "../../store/slices/habitSlice";
import Button from "../Button";
import AddHabitModal from "../Habits/AddHabit";
import NoteModal from "./NoteModal";


const COLORS = ["#00ff99", "#ff4d4d"];

const quotes = [
    "Small steps every day lead to big changes. 🚀",
    "Consistency is the key to success. 🔑",
    "You don’t have to be extreme, just consistent. 💪",
    "One day or day one. You decide. 🧭",
    "Progress, not perfection. 🌱",
    "Stay committed, even on the hard days. ⏳",
    "Habits are the compound interest of self-improvement. 📈",
    "Push yourself, because no one else is going to do it for you. 🔥",
    "Discipline is doing it even when you don’t feel like it. 🧠",
    "Every action you take is a vote for the person you want to become. 🗳️"
];

const randomIndex = Math.floor(Math.random() * quotes.length);
const randomQuote = quotes[randomIndex];


const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modalVariants = {
    hidden: {
        y: "-100vh",
        opacity: 0,
        scale: 0.8,
        rotate: 20,
    },
    visible: {
        y: "0",
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
        scale: 0.8,
        transition: { ease: "easeInOut", duration: 0.3 },
    },
};

const DateModal = ({ isOpen, onClose, selectedDate }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);

    const userId = useSelector((state) => state.auth.userId);
    const progress = useSelector(selectProgressData);
    const habits = useSelector((state) => state.habits.habits) || [];
    const totalHabits = useSelector((state) => state.habits.totalHabits) || [];

    useEffect(() => {
        dispatch(fetchProgress(userId));
        dispatch(fetchUserHabits(userId));
    }, [dispatch, userId]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    const handleClickOutside = (e) => {
        if (e.target.classList.contains("modal-backdrop")) {
            onClose();
        }
    };

    const formattedDate = useMemo(() => {
        if (selectedDate) {
            const localDate = new Date(selectedDate);
            // Local date with YYYY-MM-DD format
            return localDate.toLocaleDateString('en-CA'); // 'en-CA' is equivalent to 'YYYY-MM-DD'
        }
        return '';
    }, [selectedDate]);


    const combinedData = useMemo(() => {
        return habits.map((habit) => {
            const habitProgress = progress?.[habit.id];
            const completionData = habitProgress?.completion?.[formattedDate];

            // If there's no progress data, set `hasProgress` to false and `completed` to false
            if (!completionData) {
                return {
                    id: habit.id,
                    name: habit.name,
                    category: habit.category || "Uncategorized",
                    frequency: habit.frequency || "N/A",
                    maxStreak: "N/A",
                    averageCompletion: 0,
                    completed: false,  // Mark as not completed if there's no progress data
                    hasProgress: false,
                    completionPercent: 0,
                };
            }

            const totalTicks = completionData?.ticks?.length || 0;
            const completedTicks = completionData?.ticks?.filter(tick => tick === true).length || 0;
            const completionPercentage = totalTicks > 0 ? (completedTicks / totalTicks) * 100 : 0;
            const completed = completedTicks === totalTicks;

            return {
                id: habit.id,
                name: habit.name,
                category: habit.category || "Uncategorized",
                frequency: habit.frequency || "N/A",
                maxStreak: habitProgress?.maxStreak ?? "N/A",
                averageCompletion: completionPercentage ?? 0,
                completed,  // Mark as completed only if `completedTicks === totalTicks`
                hasProgress: !!completionData,
                completionPercent: completionPercentage,
            };
        });
    }, [habits, progress, formattedDate]);


    const barChartData = combinedData.map((habit) => ({
        name: habit.name,
        progress: habit.completionPercent,
    }));

    const pieChartData = [
        {
            name: "Completed",
            value: combinedData.filter((h) => h.completed).length,
        },
        {
            name: "Pending",
            value: combinedData.filter((h) => !h.completed).length,
        },
    ];






    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={handleClickOutside}
                >
                    <motion.div
                        className="modal-content futuristic"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>

                        <h2 className="modal-title glow-text">
                            {selectedDate?.toDateString()}
                        </h2>

                        <div className="modal-main-content">
                            {/* Left Panel */}
                            <div className="left-holo-container">

                                 {/* Extra Bottom Box */}
                                 <div className="holo-card holo-card-top">
                                    <div className="extra-content">

                                        <div className="action-btn">

                                            <button className="glow-button" onClick={() => setIsModalOpen(true)}> Add New Habit </button>

                                            <button className="glow-button" onClick={() => setIsNoteOpen(true)}> 📒 Add Quick Note </button>

                                            {isModalOpen && (
                                                <AddHabitModal
                                                    closeModal={() => setIsModalOpen(false)}
                                                    closeOnOutsideClick={() => setIsModalOpen(false)}
                                                />
                                            )}

                                            {isNoteOpen && (
                                                <NoteModal
                                                    closeNote={() => setIsNoteOpen(false)}
                                                    closeOnOutsideClick={() => setIsNoteOpen(false)}
                                                    selectedDate={selectedDate}
                                                    userId={userId} 
                                                />
                                            )}

                                        </div>



                                        <div className="extra-info">
                                            {/* Marked Habits */}
                                            <div>
                                                <p className="sub-heading">📌 <strong>Today's Marked Habits:</strong></p>
                                                <ul>
                                                    {totalHabits.filter(habit => {
                                                        const markDateFormatted = habit.markDate
                                                            ? new Date(habit.markDate).toISOString().split("T")[0]
                                                            : null;
                                                        return markDateFormatted === formattedDate;
                                                    }).map((habit, index) => (
                                                        <li key={index}>
                                                            <strong>{habit.name}</strong> – <span>{habit.description || "No description available"}</span>
                                                        </li>
                                                    ))}

                                                    {totalHabits.filter(habit => {
                                                        const markDateFormatted = habit.markDate
                                                            ? new Date(habit.markDate).toISOString().split("T")[0]
                                                            : null;
                                                        return markDateFormatted === formattedDate;
                                                    }).length === 0 && (
                                                            <li className="no-habits">This Day is not Marked for any Task</li>
                                                        )}
                                                </ul>
                                            </div>

                                            {/* Start Date Habits */}
                                            <div>
                                                <p className="sub-heading">⏳ <strong>Habits Starting Today:</strong></p>
                                                <ul>
                                                    {totalHabits.filter(habit => {
                                                        const startDateFormatted = habit.startDate
                                                            ? new Date(habit.startDate).toISOString().split("T")[0]
                                                            : null;
                                                        return startDateFormatted === formattedDate;
                                                    }).map((habit, index) => (
                                                        <li key={index}>
                                                            <strong>{habit.name}</strong> – <span className="no-habits">{habit.description || "No description available"}</span>
                                                        </li>
                                                    ))}

                                                    {totalHabits.filter(habit => {
                                                        const startDateFormatted = habit.startDate
                                                            ? new Date(habit.startDate).toISOString().split("T")[0]
                                                            : null;
                                                        return startDateFormatted === formattedDate;
                                                    }).length === 0 && (
                                                            <li className="no-habits">No new habits starting today.</li>
                                                        )}
                                                </ul>
                                            </div>
                                        </div>




                                    </div>

                                    <p className="motivational-quote">“{randomQuote}”</p>

                                </div>

                                <div className="holo-card holo-card-bottom">
                                    <h3 className="holo-title">🧠 Habit Snapshot</h3>
                                    <ul className="holo-list">
                                        {combinedData.length > 0 ? (
                                            combinedData.map((habit, idx) => (
                                                <li key={idx}>
                                                    <span className={`holo-dot ${habit.completed ? "green" : "red"}`}></span>
                                                    <strong>{habit.name}</strong> [{habit.category}]

                                                    <br />

                                                    ➤ Frequency: {habit.frequency} | Max Streak: {habit.maxStreak}

                                                    <br />

                                                    ➤
                                                    {habit.hasProgress
                                                        ? ` Completion: ${habit.completionPercent}%`
                                                        : " No progress data yet"}


                                                </li>
                                            ))
                                        ) : (
                                            <li>No habits found.</li>
                                        )}
                                    </ul>
                                </div>

                               
                            </div>

                            {/* Right Panel */}
                            <div className="right-holo-container">
                                

                                <div className="holo-card holo-card-top">
                                    <h3 className="holo-title">🌀 Circular Progress</h3>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const { name, value } = payload[0].payload;
                                                        return (
                                                            <div className="custom-tooltip">
                                                                <p className="tooltip-title">{name}</p>
                                                                <p className="tooltip-value">Value: {value}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                        <div className="pie-chart-summary">
                                            <div className="status-summary">
                                                <div className="status-box completed">Complete : {pieChartData.find(item => item.name === "Completed")?.value || 0}</div>
                                                <div className="status-box incomplete">Incomplete :
                                                    {pieChartData.find(item => item.name === "Pending")?.value || 0}</div>
                                            </div>
                                        </div>
                                    </ResponsiveContainer>

                                </div>

                                <div className="holo-card holo-card-bottom">
                                    <h3 className="holo-title">📊 Bar Progress</h3>
                                    <ResponsiveContainer width="90%" height={220}>
                                        <BarChart data={barChartData}>
                                            <CartesianGrid strokeDasharray="2 5" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} />

                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const { name, progress } = payload[0].payload;
                                                        return (
                                                            <div className="custom-tooltip">
                                                                <p className="tooltip-title">{name}</p>
                                                                <p className="tooltip-progress">Progress: {progress}%</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />

                                            <Bar
                                                dataKey="progress"
                                                fill="#00ff99"
                                                animationDuration={1500}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>




                        <div className="modal-footer glow-text">
                            ⚡ System Log: {combinedData.length ? "Mission scanned and logged." : "No data found for selected date."}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DateModal;
