import { createStore } from "redux";

const intialState = {
  dataUsers: {},
  dataPemesan: {
    data: {},
    id: [],
  },
  dataProduk: {
    data: {},
    id: [],
  },
  refresh: false,
  showArrow: true,
};

const reducer = (state = intialState, action) => {
  if (action.type === "UPDATE_USERS") {
    return {
      ...state,
      dataUsers: action.payload,
    };
  }

  if (action.type === "UPDATE_PEMESAN") {
    return {
      ...state,
      dataPemesan: {
        data: action.payload,
        id: action.id,
      },
    };
  }

  if (action.type === "UPDATE_PRODUK") {
    return {
      ...state,
      dataProduk: {
        data: action.payload,
        id: action.id,
      },
    };
  }

  if (action.type === "REFRESH") {
    return {
      ...state,
      refresh: action.payload,
    };
  }

  if (action.type === "SHOW_ARROW") {
    return {
      ...state,
      showArrow: action.payload,
    };
  }

  return state;
};

const store = createStore(reducer);

export default store;
