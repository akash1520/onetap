import { combineReducers } from "@reduxjs/toolkit";
import background from "screens/background/stores/background";
import desktop from "screens/desktop/stores/desktop";

const rootReducer = combineReducers({
  background,
  desktop
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
