import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackgroundState, EventPayload, InfoPayload, UserInfo } from "types";
import { gameDataHandlers } from "./helperFunctions";

// TODO:

const initialState: BackgroundState = {
  events: [],
  infos: [],
  gameId: 21640,
  gameData: {
    21640: {
      match_start: "2024-03-31T19:08:38.679Z",
      match_end: "2024-04-8T18:30:00.000Z",
      total_kills: 0,
      deaths: 0,
      assists: 0,
      headshot: 0,
      spikes_defuse: 0,
      spikes_planted: 0,
      damage_done: 0,
      team_scores: 0,
      agent: "",
      region: "",
      game_mode: "",
      damage_taken: 0,
      match_status: "false",
    },
    9898: {},
    7314: {},
  },
  userId: 3,
  recentlyCompletedChallenges: [],
  userInfo: {
    id: 0,
    userName: "",
    profilePicture: null,
    userCoustomeId: "",
    profileName: "",
    globalRanking: 0,
    balance: 0,
    Auth: "",
    level: 0,
    premiumUser: false,
  },
  flag: false,
};

export const setUserId = createAsyncThunk<
  number,
  string,
  { state: BackgroundState; rejectValue: string }
>("backgroundScreen/setUserId", async (authId, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${authId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const { userId } = await response.json();
    return userId;
  } catch (error) {
    return rejectWithValue("Failed to fetch user id");
  }
});

export const setUserInfo = createAsyncThunk<
  UserInfo,
  string,
  { state: BackgroundState; rejectValue: string }
>("backgroundScreen/setUserInfo", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:3000/user/basic-info/${userId}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    return rejectWithValue("Failed to fetch user info");
  }
});

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setEvent(state, action: EventPayload) {
      action.payload.events.forEach((event) => {
        console.log(
          `Event Name: ${event.name}, Data: ${JSON.stringify(event.data)}, Timestamp: ${action.payload.timestamp}`
        );
      });

      state.events.push(action.payload);

      if (isNaN(state.gameId)) {
        console.error(`No handler for gameId: ${state.gameId}`);
        return;
      } else {
        const handler = gameDataHandlers[state.gameId];
        const updatedGameData = handler(state, action);

        if (updatedGameData) {
          state.gameData[state.gameId] = updatedGameData;
        } else {
          console.error("Handler did not return updated game data");
        }
      }
    },
    setInfo(state, action: InfoPayload) {
      console.log(`Timestamp: ${action.payload.timestamp}`);
      state.infos.push(action.payload);
    },
    setRecentlyCompletedChallenges(state, action) {
      console.log(`RecentlyCompletedChallenges`, JSON.stringify(action.payload));
      state.recentlyCompletedChallenges = action.payload;
      console.log(`RecentlyCompletedChallenges`, JSON.stringify(state.recentlyCompletedChallenges));

    },
    setGameId(state, action: PayloadAction<number>) {
      if (isNaN(state.gameId)) {
        state.gameId = action.payload;
        console.log("game id set successfully", state.gameId);
      } else {
        console.log("game id is already set", state.gameId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserId.fulfilled, (state, action) => {
        state.userId = action.payload;
      })
      .addCase(setUserId.rejected, () => {
        console.error("Failed to fetch user Id!");
      });

    builder
      .addCase(setUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(setUserInfo.rejected, () => {
        console.error("Failed to fetch basic info data!");
      });
  },
});

export const { setEvent, setInfo, setRecentlyCompletedChallenges, setGameId } =
  backgroundSlice.actions;

export default backgroundSlice.reducer;
