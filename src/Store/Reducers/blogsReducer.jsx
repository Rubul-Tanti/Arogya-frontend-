import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
 
const initialState={
      blogsid:"",
  allBlogs:{
    isLoading: true,
    error: false,
    data:false,
  },
  blog:{
    isLoading: true,
    error: false,
    data:false,
  }
}

 export const FetchallBlogs=createAsyncThunk("/blogs",async()=>{
      const response = await Axios.get(`https://arogya-backend-pjtu.onrender.com/user/blogs/yoga`);
    return response.data.data;
  })
 export const FetchBlog=createAsyncThunk("/blog",async(id)=>{
      const response = await Axios.get(`https://arogya-backend-pjtu.onrender.com/user/getblog/${id}`);
    return response.data.data;
  })

const blogsclise=createSlice({
    name:"blog",initialState,
    reducers:{
        setBlogsid:(state,action)=>{
            state.blogsid=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(FetchallBlogs.pending, (state) => {
        state.allBlogs.isLoading = true;
        state.allBlogs.error = null;
      })
      .addCase(FetchallBlogs.fulfilled, (state, action) => {
        state.allBlogs.isLoading = false;
        state.allBlogs.data = action.payload;
      })
      .addCase(FetchallBlogs.rejected, (state, action) => {
        state.allBlogs.isLoading = false;
        state.allBlogs.error = action.error.message;
      }).addCase(FetchBlog.pending, (state) => {
        state.blog.isLoading = true;
        state.blog.error = null;
      })
      .addCase(FetchBlog.fulfilled, (state, action) => {
        state.blog.isLoading = false;
        state.blog.data = action.payload;
      })
      .addCase(FetchBlog.rejected, (state, action) => {
        state.blog.isLoading = false;
        state.blog.error = action.error.message;
      })
    }
})
 
 export const {
  setBlogsid
 } = blogsclise.actions;
 

 export default blogsclise.reducer;