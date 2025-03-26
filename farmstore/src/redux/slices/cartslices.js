import {createSlice,createSelector } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name:"Cart",
    initialState:[],
    reducers:{
        addItem:(state,action)=>{
            state.push(action.payload)
        },
        removeItem:(state,action)=>{
            return state.filter(item=>item.seed_breed !== action.payload.seed_breed);
        }
    }
})

export const getItemSelector = createSelector(state=>state.cart,state=>state)

export const { addItem,removeItem } = cartSlice.actions

export default cartSlice.reducer;