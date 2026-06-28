import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:JSON.parse(localStorage.getItem('user')) || null,
        token:localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token')
    },
    reducers:{
        addUser:(state,action)=>{
            const {token, user} =action.payload;
            state.user = user;
            state.token =token;
            state.isAuthenticated =true;
            localStorage.setItem('user',JSON.stringify(user));
            localStorage.setItem('token',token);
        },
        removeUser:(state,action)=>{
            state.user = null;
            state.token =null;
            state.isAuthenticated =false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
})


export const {addUser,removeUser}= authSlice.actions;

export default authSlice.reducer; 