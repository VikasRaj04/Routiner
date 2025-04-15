const getFirebaseErrorMessage = (error) => {
    const code = error?.code || "";
    const message = error?.message || "";

    switch (code) {
        // Firebase Auth Errors
        case "auth/email-already-in-use":
            return "This email is already registered. Please use a different email.";
        case "auth/invalid-email":
            return "The email address is not valid.";
        case "auth/weak-password":
            return "The password is too weak. Please choose a stronger password.";
        case "auth/operation-not-allowed":
            return "Email/password accounts are not enabled. Please contact support.";
        case "auth/user-disabled":
            return "This user account has been disabled.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/too-many-requests":
            return "Too many login attempts. Please try again later.";
        case "auth/network-request-failed":
            return "Network error occurred. Please check your internet connection.";
        case "auth/popup-closed-by-user":
            return "The sign-in popup was closed before completing the sign-in.";
        case "auth/cancelled-popup-request":
            return "Popup request was cancelled due to another popup being opened.";
        case "auth/popup-blocked":
            return "Popup was blocked by the browser. Please allow popups.";
        case "auth/internal-error":
            return "An internal error occurred. Please try again.";

        // Firestore / Realtime DB Errors
        case "permission-denied":
            return "You do not have permission to perform this action.";
        case "unavailable":
            return "The service is currently unavailable. Please try again later.";
        case "deadline-exceeded":
            return "The operation took too long to complete. Please try again.";
        case "not-found":
            return "Requested data was not found.";
        case "already-exists":
            return "This item already exists.";
        case "resource-exhausted":
            return "Quota exceeded. Try again later.";

        // Firebase Storage Errors
        case "storage/object-not-found":
            return "The requested file does not exist.";
        case "storage/unauthorized":
            return "You are not authorized to access this file.";
        case "storage/canceled":
            return "The upload was canceled.";
        case "storage/unknown":
            return "An unknown error occurred with storage.";

        // Network Errors
        case "net::ERR_INTERNET_DISCONNECTED":
        case "ERR_INTERNET_DISCONNECTED":
            return "You are offline. Please check your internet connection.";
        case "net::ERR_CONNECTION_TIMED_OUT":
        case "ERR_CONNECTION_TIMED_OUT":
            return "The connection timed out. Please try again.";
        case "net::ERR_NETWORK_CHANGED":
        case "ERR_NETWORK_CHANGED":
            return "Your network connection changed. Please try again.";
        case "net::ERR_NAME_NOT_RESOLVED":
        case "ERR_NAME_NOT_RESOLVED":
            return "Unable to resolve the server. Please check your connection.";
    }

    // 🔁 Extra fallback using error.message
    if (message.includes("client is offline")) {
        return "You are offline. Please check your internet connection.";
    }

    if (message.includes("Failed to get document")) {
        return "Failed to fetch data. Please check your network and try again.";
    }

    if (message.includes("quota exceeded")) {
        return "You’ve reached your quota limit. Please try again later.";
    }

    if (message.includes("timeout")) {
        return "The request timed out. Try again in a few seconds.";
    }

    // 🚨 Default fallback
    return "An unexpected error occurred. Please try again later.";
};

export default getFirebaseErrorMessage;
