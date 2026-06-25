import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {Root} from './type';

// Define a type for the slice state

// Define the initial state using that type
const initialState: Root = {
  user: null,
  isAuth: false,
  isOnBoarded: false,
  cartItems: null,
  newImages: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<any>) => {
      state.isAuth = action.payload;
    },
    setIsOnboarded: (state, action: PayloadAction<any>) => {
      state.isOnBoarded = action.payload;
    },
    setCartItems: (state, action: PayloadAction<any>) => {
      state.cartItems = action.payload;
    },
    setNewImages: (state, action: PayloadAction<any>) => {
      state.newImages = action.payload;
    },
    removeImage: (state, action: PayloadAction<any>) => {
      const imageId = action.payload;
      state.newImages = state.newImages.filter(
        (item: {id: any}) => item.id !== imageId,
      );
    },
  },
});

export const {
  setUserData,
  setIsAuth,
  setIsOnboarded,
  setCartItems,
  setNewImages,
  removeImage,
} = userSlice.actions;

export default userSlice.reducer;
