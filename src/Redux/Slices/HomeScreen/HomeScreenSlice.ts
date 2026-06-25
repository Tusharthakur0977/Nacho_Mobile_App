import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {Node, Root, Product, SuggestedTour} from './type';

// Define the initial state using that type
const initialState: Root = {
  HomeScreenData: null,
  filtersData: null,
  suggestedTours: null,
  productsCache: {
    'flight-and-land-packages': {
      products: [],
      hasMore: true,
      endCursor: null,
    },
    'no-flights': {
      products: [],
      hasMore: true,
      endCursor: null,
    },
  },
};

export const userSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeScreenData: (
      state,
      action: PayloadAction<{
        countries: Node[];
        others: Node[];
      }>,
    ) => {
      state.HomeScreenData = action.payload;
    },
    setSuggestedTours: (state, action: PayloadAction<SuggestedTour[]>) => {
      state.suggestedTours = action.payload;
    },
    setFiltersData: (
      state,
      action: PayloadAction<{
        countries?: string[];
        durations?: string[];
        years?: string[];
        events?: string[];
        self_drives?: string[];
        cities?: string[];
      }>,
    ) => {
      state.filtersData = action.payload;
    },
    appendProductsToCache: (
      state,
      action: PayloadAction<{
        type: 'flight-and-land-packages' | 'no-flights';
        products: Product[];
        hasMore: boolean;
        endCursor: string | null;
      }>,
    ) => {
      const cache = state.productsCache[action.payload.type];
      cache.products = [...cache.products, ...action.payload.products];
      cache.hasMore = action.payload.hasMore;
      cache.endCursor = action.payload.endCursor;
    },
    setProductsCache: (
      state,
      action: PayloadAction<{
        type: 'flight-and-land-packages' | 'no-flights';
        products: Product[];
        hasMore: boolean;
        endCursor: string | null;
      }>,
    ) => {
      state.productsCache[action.payload.type] = {
        products: action.payload.products,
        hasMore: action.payload.hasMore,
        endCursor: action.payload.endCursor,
      };
    },
    clearProductsCache: (
      state,
      action: PayloadAction<'flight-and-land-packages' | 'no-flights'>,
    ) => {
      state.productsCache[action.payload] = {
        products: [],
        hasMore: true,
        endCursor: null,
      };
    },
  },
});

export const {
  setHomeScreenData,
  setFiltersData,
  appendProductsToCache,
  setProductsCache,
  clearProductsCache,
  setSuggestedTours,
} = userSlice.actions;

export default userSlice.reducer;
