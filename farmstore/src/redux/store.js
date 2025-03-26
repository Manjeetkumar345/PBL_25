import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartslices'

export const  store = configureStore({
    reducer:{
        cart:cartReducer,
    }
})