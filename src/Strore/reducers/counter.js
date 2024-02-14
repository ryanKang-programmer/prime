// reducers/counter.js

export const INCRESE = "COUNT/INCRESE";

export const increseCount = () => ({ type: INCRESE });

const initalState = {
  count: 0
};

const counter = (state = initalState, action) => {
    switch (action.type) {
        case INCRESE:
            const count = state.count + 1;
            return {
            ...state,
            count
    };
    default:
      return state;
  }
};

export default counter;
 