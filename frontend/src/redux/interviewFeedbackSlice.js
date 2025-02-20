import { createSlice } from "@reduxjs/toolkit";

const interviewFeedbackSlice = createSlice({
  name: "interviewFeedback",
  initialState: {
    feedbackList: [], // Stores multiple feedback objects
  },
  reducers: {
    addFeedback: (state, action) => {
        console.log("Dispatched addFeedback:", action.payload);
        if (state.feedbackList.length >= 5) {
            state.feedbackList = []; // Clear the list
            console.log("Feedback list cleared as it exceeded 5 entries.");
          } 
      state.feedbackList.push(action.payload); // Add new feedback to the list
    },
    clearFeedbacks: (state) => {
      state.feedbackList = []; // Clear all feedbacks
    },
  },
});

export const { addFeedback, clearFeedbacks } = interviewFeedbackSlice.actions;
export default interviewFeedbackSlice.reducer;
