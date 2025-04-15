import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    doc as firestoreDoc,
    getDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import logo from "../logo.png";

// ⬅️ Helper to load image as a Promise
const loadImageAsPromise = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load logo image"));
    });
};

export const generateUserReport = async (userId) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const now = new Date().toLocaleString();

    try {
        // Load logo BEFORE anything else
        try {
            const img = await loadImageAsPromise(logo);
            const maxWidth = 40;
            const maxHeight = 20;
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = img.width * ratio;
            const height = img.height * ratio;
            pdf.addImage(img, "PNG", 150, 30, width, height);

            // 👇 Logo ke niche thoda gap ke saath
            pdf.setFont("helvetica", "bold"); // ya font-family and style dono
            pdf.setFontSize(15);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Routiner", 150, 30 + height + 6);
        } catch (err) {
            console.warn("Logo not added:", err.message);
        }

        // 📄 Fetch User Info
        const userRef = firestoreDoc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        if (!userData) throw new Error("User not found");

        // 📄 Fetch Subcollections
        const [habitsSnap, progressSnap, badgesSnap, historySnap, notesSnap] = await Promise.all([
            getDocs(collection(db, "users", userId, "habits")),
            getDocs(collection(db, "users", userId, "progress")),
            getDocs(collection(db, "users", userId, "badges")),
            getDocs(collection(db, "users", userId, "history")),
            getDocs(collection(db, "users", userId, "notes")),  // Fetching notes subcollection
        ]);

        const habits = habitsSnap.docs.map((doc) => doc.data());
        const rawProgress = progressSnap.docs.map((doc) => doc.data());
        const badges = badgesSnap.docs.map((doc) => doc.data());
        const history = historySnap.docs.map((doc) => doc.data());
        const notes = notesSnap.docs.map((doc) => doc.data());  // Extracting notes data

        // 🧾 Title
        pdf.setFontSize(22);
        pdf.setTextColor(40, 40, 40);
        pdf.text("Routiner Progress Report", 14, 30);

        // ℹ️ User Info
        pdf.setFontSize(12);
        pdf.setTextColor(70, 70, 70);
        pdf.text(`Generated on: ${now}`, 14, 40);
        pdf.text(`Name: ${userData.name || "N/A"}`, 14, 48);
        pdf.text(`Email: ${userData.email || "N/A"}`, 14, 54);
        pdf.text(`Gender: ${userData.gender || "N/A"}`, 14, 60);
        pdf.text(`Birthdate: ${userData.birth || "N/A"}`, 14, 66);
        pdf.text(`Custom ID: ${userData.customId || "N/A"}`, 14, 72);
        pdf.setDrawColor(200);
        pdf.line(14, 76, 200, 76);

        // 📋 Habits Table
        autoTable(pdf, {
            startY: 82,
            head: [["Habit", "Category", "Frequency", "Description"]],
            body: habits.map((h) => [
                h.name || "N/A",
                h.category || "N/A",
                h.frequency || "N/A",
                h.description || "-",
            ]),
            theme: "grid",
            styles: { cellPadding: 2, fontSize: 10 },
            headStyles: { fillColor: [100, 150, 255] },
        });

        // 📊 Progress Table
        const parsedProgress = rawProgress.flatMap((entry) => {
            const dateEntries = entry.completion || {};
            return Object.entries(dateEntries).map(([date, data]) => ({
                habitName: entry.habitName || "N/A",
                date,
                completionRate: data.completion ?? "N/A",
                streak: entry.streaks ?? "N/A",
                totalCompleted: entry.totalCompleted ?? "N/A",
                totalDaysTracked: entry.totalDaysTracked ?? "N/A",
            }));
        });

        autoTable(pdf, {
            startY: pdf.lastAutoTable.finalY + 10,
            head: [["Habit", "Date", "Completion %", "Streak", "Completed", "Days Tracked"]],
            body: parsedProgress.map((p) => [
                p.habitName,
                p.date,
                `${p.completionRate}%`,
                p.streak,
                p.totalCompleted,
                p.totalDaysTracked,
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [120, 200, 150] },
        });

        // 🏅 Badges
        autoTable(pdf, {
            startY: pdf.lastAutoTable.finalY + 10,
            head: [["Badge", "Unlocked", "Unlocked At", "Description"]],
            body: badges.map((b) => [
                b.name || "-",
                b.unlockedAt ? "Yes" : "No",
                b.unlockedAt ? new Date(b.unlockedAt.seconds * 1000).toLocaleString() : "-",
                b.description || "-",
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [230, 100, 150] },
        });

        // 📝 Notes
        if (notes.length > 0) {
            autoTable(pdf, {
                startY: pdf.lastAutoTable.finalY + 10,
                head: [["Note", "Date"]],
                body: notes.map((n) => [
                    n.note || "N/A",
                    n.date ? new Date(n.date.seconds * 1000).toLocaleString() : "N/A",
                ]),
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [100, 100, 255] },
            });
        }


        // 📜 History
        autoTable(pdf, {
            startY: pdf.lastAutoTable.finalY + 10,
            head: [["Habit ID", "Timestamp", "Action"]],
            body: history.map((h) => [
                h.habitId || "N/A",
                h.timestamp || "N/A",
                h.action || "-",
            ]),
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [255, 180, 100] },
        });

        
        // 📦 Summary
        pdf.setFontSize(16);
        const summaryY = pdf.lastAutoTable.finalY + 20;
        pdf.text("Summary", 14, summaryY);
        pdf.setFontSize(12);
        pdf.text(`Total Habits: ${habits.length}`, 14, summaryY + 10);
        pdf.text(`Total Progress Entries: ${parsedProgress.length}`, 14, summaryY + 16);
        pdf.text(`Badges Unlocked: ${badges.filter((b) => b.unlockedAt).length}`, 14, summaryY + 22);

        // ✅ Save PDF
        pdf.save(`${userData.name}_Routiner_Report.pdf`);
    } catch (err) {
        console.error("Error generating report:", err);
    }
};
