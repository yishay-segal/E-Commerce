let initalState = [];

// load cart items from local storage
if (window) {
  if (localStorage.getItem('cart')) {
    initalState = JSON.parse(localStorage.getItem('cart'));
  } else {
    initalState = [];
  }
}

export const cartReducer = (state = initalState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return action.payload;
    default:
      return state;
  }
};
