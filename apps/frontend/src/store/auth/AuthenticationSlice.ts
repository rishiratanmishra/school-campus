import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tokens: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.initialized = true;
      console.log('Redux: setAuthUser called', action.payload.user); // Debug log
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.initialized = true;
      console.log('Redux: clearAuth called'); // Debug log
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
      console.log('Redux: setTokens called', action.payload); // Debug log
    },
    setInitialize: (state) => {
      state.initialized = true;
      console.log('Redux: setInitialize called'); // Debug log
    },
    // Combined action for setting both user and tokens
    loginSuccess: (state, action: PayloadAction<{ user: any; tokens?: AuthTokens }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.initialized = true;
      if (action.payload.tokens) {
        state.tokens = action.payload.tokens;
      }
      console.log('Redux: loginSuccess called', action.payload); // Debug log
    },
  },
});

export const { setAuthUser, clearAuth, setTokens, setInitialize, loginSuccess } =
  authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectTokens = (state: RootState) => state.auth.tokens;
export const selectAccessToken = (state: RootState) =>
  state.auth.tokens?.accessToken || '';
export const selectRefreshToken = (state: RootState) =>
  state.auth.tokens?.refreshToken || '';
export const selectIsAuthInitialized = (state: RootState) =>
  state.auth.initialized;