import React from "react";
import immer from "immer";
import noop from "noop-ts";
import { ApiKey, UserDetails } from "../../services/UserService/UserServiceFP";
import { none, Option } from "fp-ts/es6/Option";

export interface UserState {
  apiKey: Option<ApiKey>;
  user: Option<UserDetails>;
  // TODO: do we really need this flag??
  // loggedIn: boolean;
}

export const initialUserState: UserState = {
  apiKey: none,
  user: none,
  // loggedIn: false,
};

export type UserAction =
  | { type: "SET_API_KEY"; apiKey: Option<ApiKey> }
  | { type: "UPDATE_USER_DATA"; user: Partial<UserDetails> }
  | { type: "LOG_IN"; user: Option<UserDetails> }
  | { type: "LOG_OUT" };

const UserReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_API_KEY":
      return immer(state, (draftState) => {
        draftState.apiKey = action.apiKey;
      });
    case "UPDATE_USER_DATA":
      return immer(state, (draftState) => {
        if (!draftState.user) return;
        draftState.user = { ...draftState.user, ...action.user };
      });
    case "LOG_IN":
      return immer(state, (draftState) => {
        draftState.user = action.user;
      });
    case "LOG_OUT":
      return immer(state, (draftState) => {
        draftState.apiKey = none;
        draftState.user = none;
      });
  }
};

export const UserContext = React.createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialUserState,
  dispatch: noop,
});

export const UserContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(UserReducer, initialUserState);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
