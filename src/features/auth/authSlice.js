// src/features/auth/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../firebase/firebase";
import { axiosPublic } from "../../hooks/userAxiosPublic";
import { serializeUser } from "../../utils/serializeUser";

const provider = new GoogleAuthProvider();
provider.addScope("email");

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password, photoURL, role, coins }, thunkAPI) => {
    try {
      // 1) Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2) Update profile
      await updateProfile(res.user, {
        displayName: name,
        photoURL,
      });

      // 3) Post to your backend
      await axiosPublic.post("/users", {
        name,
        email,
        photoURL,
        role,
        coins,
        uid: res.user.uid,
      });

      // 4) Re-fetch the user
      await res.user.reload();

      // 5) Return serialized user
      return serializeUser(auth.currentUser);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ email, password }, thunkAPI) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return serializeUser(res.user);
  }
);

export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (_, thunkAPI) => {
    const res = await signInWithPopup(auth, provider);
    return serializeUser(res.user);
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, thunkAPI) => {
    await signOut(auth);
    return null;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, thunkAPI) => {
    await sendPasswordResetEmail(auth, email);
    return;
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (updatedData, thunkAPI) => {
    if (!auth.currentUser) throw new Error("No authenticated user found");
    await updateProfile(auth.currentUser, updatedData);

    // Re-fetch the user to get updated fields
    await auth.currentUser.reload();

    return serializeUser(auth.currentUser);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUserDirectly: (state, action) => {
      state.user = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.user = serializeUser(action.payload);
        state.loading = false;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.user = serializeUser(action.payload);
        state.loading = false;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
  },
});

export const { setUserDirectly, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
