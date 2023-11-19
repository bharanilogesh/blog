// userReducer.js
export const SET_USER_DATA = 'SET_USER_DATA';

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, user: action.userData };
    // Add other cases if needed
    default:
      return state;
  }
};

export default userReducer;
