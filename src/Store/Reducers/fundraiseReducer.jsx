// src/redux/appSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

// Initial State
const initialState = {
  id: '684e77d81f867b5bcf48b4b9',
  Fundraisingprofile: {
    isLoading: true,
    error: false,
    data:false,
  },
  allFundraiseingcampaign: {
    isLoading: true,
    error: false,
    data:false,
  },

  };


// Thunk for fetching the fundraising profile
 const FetchfundraisingProfile = createAsyncThunk(
  'data/fetchFundraisingProfile',
  async (id) => {
    const response = await Axios.get(
      `https://arogya-backend-pjtu.onrender.com/user/raisingFundProfile/${id}`
    );
    return response.data.data;
  }
);
 export const Fetchallfundraisecampaign = createAsyncThunk(
  'getraisingFund/all',
  async () => {

    const response = await Axios.get(`https://arogya-backend-pjtu.onrender.com/user/getraisingFund/all`);
    return response.data.data;
  }
);

// Redux Slice
const appSlice = createSlice({
  name: 'fundraise',
  initialState,
  reducers: {
    setFundraiseid: (state, action) => {
      state.id = action.payload;
    },
    setFundraisingprofile: (state, action) => {
      state.Fundraisingprofile = {
        isLoading: false,
        error: null,
        data: action.payload,
      };
    },
    setAllFundRaisingProfile: (state, action) => {
      state.allFundraiseingcampaign = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchfundraisingProfile.pending, (state) => {
        state.Fundraisingprofile.isLoading = true;
        state.Fundraisingprofile.error = null;
      })
      .addCase(FetchfundraisingProfile.fulfilled, (state, action) => {
        state.Fundraisingprofile.isLoading = false;
        state.Fundraisingprofile.data = action.payload;
      })
      .addCase(FetchfundraisingProfile.rejected, (state, action) => {
        state.Fundraisingprofile.isLoading = false;
        state.Fundraisingprofile.error = action.error.message;
      })
      .addCase(Fetchallfundraisecampaign.pending, (state) => {
        state.allFundraiseingcampaign.isLoading = true;
        state.allFundraiseingcampaign.error = null;
      })
      .addCase(Fetchallfundraisecampaign.fulfilled, (state, action) => {
        state.allFundraiseingcampaign.isLoading = false;
        state.allFundraiseingcampaign.data = action.payload;
      })
      .addCase(Fetchallfundraisecampaign.rejected, (state, action) => {
        state.allFundraiseingcampaign.isLoading = false;
        state.allFundraiseingcampaign.error = action.error.message;
      })
     
  },
});

// Only export sync reducers from actions
export const {
  setFundraiseid,
  setAllFundRaisingProfile,
  setFundraisingprofile,
} = appSlice.actions;

// Export async thunk and reducer separately
export { FetchfundraisingProfile };

export default appSlice.reducer;
