const getFirebaseErrorMessage = (error) => {
    const code = error?.code || "";
    const rawMessage = error?.message || "";
    let message = "";

    switch (code) {
        // Firebase Auth Errors
        case "auth/email-already-in-use":
            message = "This email is already registered. Please use a different email.";
            break;
        case "auth/invalid-email":
            message = "The email address is not valid.";
            break;
        case "auth/weak-password":
            message = "The password is too weak. Please choose a stronger password.";
            break;
        case "auth/operation-not-allowed":
            message = "Email/password accounts are not enabled. Please contact support.";
            break;
        case "auth/user-disabled":
            message = "This user account has been disabled.";
            break;
        case "auth/user-not-found":
            message = "No account found with this email.";
            break;
        case "auth/wrong-password":
            message = "Incorrect password. Please try again.";
            break;
        case "auth/too-many-requests":
            message = "Too many login attempts. Please try again later.";
            break;
        case "auth/network-request-failed":
            message = "Network error occurred. Please check your internet connection.";
            break;
        case "auth/popup-closed-by-user":
            message = "The sign-in popup was closed before completing the sign-in.";
            break;
        case "auth/cancelled-popup-request":
            message = "Popup request was cancelled due to another popup being opened.";
            break;
        case "auth/popup-blocked":
            message = "Popup was blocked by the browser. Please allow popups.";
            break;
        case "auth/internal-error":
            message = "An internal error occurred. Please try again.";
            break;

        // Firestore / Realtime DB Errors
        case "permission-denied":
            message = "You do not have permission to perform this action.";
            break;
        case "unavailable":
            message = "The service is currently unavailable. Please try again later.";
            break;
        case "deadline-exceeded":
            message = "The operation took too long to complete. Please try again.";
            break;
        case "not-found":
            message = "Requested data was not found.";
            break;
        case "already-exists":
            message = "This item already exists.";
            break;
        case "resource-exhausted":
            message = "Quota exceeded. Try again later.";
            break;

        // Firebase Storage Errors
        case "storage/object-not-found":
            message = "The requested file does not exist.";
            break;
        case "storage/unauthorized":
            message = "You are not authorized to access this file.";
            break;
        case "storage/canceled":
            message = "The upload was canceled.";
            break;
        case "storage/unknown":
            message = "An unknown error occurred with storage.";
            break;

        // Network Errors
        case "net::ERR_INTERNET_DISCONNECTED":
        case "ERR_INTERNET_DISCONNECTED":
            message = "You are offline. Please check your internet connection.";
            break;
        case "net::ERR_CONNECTION_TIMED_OUT":
        case "ERR_CONNECTION_TIMED_OUT":
            message = "The connection timed out. Please try again.";
            break;
        case "net::ERR_NETWORK_CHANGED":
        case "ERR_NETWORK_CHANGED":
            message = "Your network connection changed. Please try again.";
            break;
        case "net::ERR_NAME_NOT_RESOLVED":
        case "ERR_NAME_NOT_RESOLVED":
            message = "Unable to resolve the server. Please check your connection.";
            break;
        default:
            message = "";
    }

    // 🔁 Fallbacks based on message string
    if (!message) {
        if (rawMessage.includes("client is offline")) {
            message = "You are offline. Please check your internet connection.";
        } else if (rawMessage.includes("Failed to get document")) {
            message = "Failed to fetch data. Please check your network and try again.";
        } else if (rawMessage.includes("quota exceeded")) {
            message = "You’ve reached your quota limit. Please try again later.";
        } else if (rawMessage.includes("timeout")) {
            message = "The request timed out. Try again in a few seconds.";
        } else {
            message = "An unexpected error occurred. Please try again later.";
        }
    }

    return message;
};

export default getFirebaseErrorMessage;
