import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase/firebase";
import { serializeUser } from "../../utils/serializeUser";
import { setAuthLoading, setUserDirectly } from "./authSlice";

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setUserDirectly(serializeUser(currentUser)));
      dispatch(setAuthLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthListener;
