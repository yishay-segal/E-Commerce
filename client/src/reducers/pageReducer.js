export const pageReducer = (state = { page: 'home' }, action) => {
  switch (action.type) {
    case 'SHOP_PAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
