export const sanitizeFirebaseUser = (user, extraData = {}) => ({
    uid: user.uid,
    email: user.email,
    name: extraData?.name || user.displayName || "",
  });
  