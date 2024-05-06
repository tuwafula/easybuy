// import * as actions from "../actionTypes/actionTypes";

// const reducer = (state = [], action) => {
//   let done = false;
//   switch (action.type) {
//     case actions.CART_ADD:
//       state.map((item, index) => {
//         if (item.id === action.payload.id) {
//           done = true;
//           if (item.avaiableQuantity > item.quantity) {
//             state[index].quantity = state[index].quantity + 1;
//           } else {
//             console.log("out of stock");
//           }

//           return state;
//         }
//       });
//       if (!done) {
//         console.log(action.payload);
//         return [
//           ...state,
//           {
//             _id: action.payload._id,
//             category: action.payload.category.name,
//             createdAt: action.payload.created_at,
//             description: action.payload.description,
//             image: action.payload.image,
//             price: action.payload.price,
//             // sku: action.payload.sku,
//             title: action.payload.name,
//             updatedAt: action.payload.updated_at,
//             avaiableQuantity: action.payload.quantity,
//             quantity: 1,
//           },
//         ];
//       }

//     case actions.CART_REMOVE:
//       return state.filter((item) => item._id !== action.payload);

//     case actions.INCREASE_CART_ITEM_QUANTITY:
//       if (action.payload.type === "increase") {
//         state.map((item, index) => {
//           if (item._id === action.payload.id) {
//             return (state[index].quantity = state[index].quantity + 1);
//           }
//         });
//       }

//     case actions.DECREASE_CART_ITEM_QUANTITY:
//       if (action.payload.type === "decrease") {
//         state.map((item, index) => {
//           if (item._id === action.payload.id) {
//             return (state[index].quantity = state[index].quantity - 1);
//           }
//         });
//       }
//     case actions.EMPTY_CART:
//       if (action.payload === "empty") {
//         state.splice(0, state.length);
//         return state;
//       }

//     default:
//       return state;
//   }
// };

// export default reducer;

import * as actions from "../actionTypes/actionTypes";

const reducer = (state = [], action) => {
  switch (action.type) {
    case actions.CART_ADD:
      console.log("ID", action.payload.id);
      const existingItemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex !== -1) {
        // Item already exists in the state, update its quantity if available
        const existingItem = state[existingItemIndex];
        if (existingItem.avaiableQuantity > existingItem.quantity) {
          return state.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          console.log("out of stock");
          return state;
        }
      } else {
        // Item does not exist in the state, add it to the state
        return [
          ...state,
          {
            id: action.payload.id,
            category: action.payload.category.name,
            createdAt: action.payload.created_at,
            description: action.payload.description,
            image: action.payload.image,
            price: action.payload.price,
            title: action.payload.name,
            updatedAt: action.payload.updated_at,
            avaiableQuantity: action.payload.quantity,
            quantity: 1,
          },
        ];
      }

    case actions.CART_REMOVE:
      return state.filter((item) => item._id !== action.payload);

    case actions.INCREASE_CART_ITEM_QUANTITY:
      return state.map((item) =>
        item._id === action.payload.id && action.payload.type === "increase"
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case actions.DECREASE_CART_ITEM_QUANTITY:
      return state.map((item) =>
        item._id === action.payload.id && action.payload.type === "decrease"
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

    case actions.EMPTY_CART:
      if (action.payload === "empty") {
        return [];
      }
      return state;

    default:
      return state;
  }
};

export default reducer;
