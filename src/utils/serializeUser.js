export const serializeUser = (user) => {
  if (!user) return null;
  return {
    accessToken: user.accessToken,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    uid: user.uid,
  };
};
