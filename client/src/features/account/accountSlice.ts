import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { router } from "../../app/router/Routes";
import { setBasket } from "../basket/basketSlice";
import { AxiosError } from "axios";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

// method returning User object & take as arguments a data as Form field's values as object
export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser", //type prefix
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const { basket, ...user } = userDto;
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      const customError: AxiosError = error as AxiosError;
      return thunkAPI.rejectWithValue({ error: customError.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    // setting token to the Redux store
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.Account.currentUser();
      const { basket, ...user } = userDto;
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      const customError: AxiosError = error as AxiosError;
      return thunkAPI.rejectWithValue({ error: customError.message });
    }
  },
  {
    // calling API only if we have a token (after browser refresh)
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
      const roles =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      state.user = {
        ...action.payload,
        roles: typeof roles === "string" ? [roles] : roles,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session expired - please login again");
      router.navigate("/");
    });
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
        // use JWT decoder to complete claim
        const roles =
          claims[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        state.user = {
          ...action.payload,
          roles: typeof roles === "string" ? [roles] : roles,
        };
      }
    );
    builder.addMatcher(isAnyOf(signInUser.rejected), (_, action) => {
      throw action.payload;
    });
  },
});

export const { signOut, setUser } = accountSlice.actions;
