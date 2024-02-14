export const SAVE = "LEAK/SIMULATION/SAVE";

export const saveLeak = (leak) => ({ type: SAVE, leak });

const initalState = {
  leakHistory: []
};

const leak = (state = initalState, action) => {
    switch (action.type) {
        case SAVE:
            const leak = action.leak;
            const newHistory = [...state.leakHistory, leak];
            return {
            ...state,
            leakHistory: newHistory,
    };
    default:
      return state;
  }
};

export default leak;
 