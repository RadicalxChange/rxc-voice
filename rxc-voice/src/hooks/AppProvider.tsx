import moment from "moment";
import React, { createContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { BgColor } from "../models/BgColor";
import { Process } from "../models/Process";
import { Transfer } from "../models/Transfer";
import { WebService } from "../services";

export interface State {
  color: BgColor,
  loading: boolean,
  creditBalance?: number,
  processes?: Process[],
  activeProcesses?: Process[],
  pastProcesses?: Process[],
  selectedProcess?: Process,
  stagedTransfer?: Transfer,
}

const actionInitialValue = {
  setColor: (color: BgColor) => {},
  logoutUser: () => {},
  setUserData: (user: any) => {},
  updateCreditBalance: (amount: any) => {},
  selectProcess: (selectedProcess: any) => {},
  fetchProcesses: () => {},
  stageTransfer: (transfer: any) => {},
};
const stateInitialValue = {
  color: BgColor.Yellow,
  loading: false,
};
export const ActionContext = createContext(actionInitialValue);
export const StateContext = createContext<State>(stateInitialValue);

export const AppProvider = (props: any) => {
  const history = useHistory();
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) =>  {
      switch (action.type) {
        case "SET_COLOR":
          return {
            ...prevState,
            color: action.color,
          };
        case "SET_USER":
          return {
            ...prevState,
            user: action.user,
          };
        case "UPDATE_CREDIT_BALANCE":
          return {
            ...prevState,
            creditBalance: action.amount,
          };
        case "SET_PROCESS_LIST":
          return {
            ...prevState,
            processes: action.processes,
            activeProcesses: action.activeProcesses,
            pastProcesses: action.pastProcesses,
          };
        case "SET_SELECTED_PROCESS":
          return {
            ...prevState,
            selectedProcess: action.selectedProcess,
          };
        case "SET_TRANSFER":
          return {
            ...prevState,
            stagedTransfer: action.transfer,
          };
        case "SET_LOADING":
          return {
            ...prevState,
            loading: action.loading,
          };
      }
    }, {
      color: BgColor.Yellow,
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")!)
        : undefined,
      loading: false,
    }
  );

  const actionContext = useMemo(
    () => ({
      setColor: (color: BgColor) => {
        switch (color) {
          case BgColor.Yellow: {
            dispatch({ type: "SET_COLOR", color: BgColor.Yellow });
            break;
          }
          case BgColor.White: {
            dispatch({ type: "SET_COLOR", color: BgColor.White });
            break;
          }
        }
      },
      setUserData: (user: any) => {
        sessionStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: "SET_USER",
          user: user,
        });
      },
      updateCreditBalance: (amount: any) => {
        dispatch({
          type: "UPDATE_CREDIT_BALANCE",
          amount: amount,
        });
      },
      logoutUser: async () => {
        sessionStorage.removeItem("user");
        history.push("/");
        dispatch({
          type: "SET_USER",
          user: null,
        });
      },
      fetchProcesses: () => {
        dispatch({ type: "SET_LOADING", loading: true });
        WebService.fetchProcesses().subscribe((data: any) => {
          var activeList: Process[] = new Array<Process>();
          var pastList: Process[] = new Array<Process>();
          if (data.length) {
            data.forEach((process: Process) => {
              if (moment(process.end_date) > moment()) {
                activeList.push(process);
              } else {
                pastList.push(process);
              }
            });
          }
          dispatch({
            type: "SET_PROCESS_LIST",
            processes: data,
            activeProcesses: activeList,
            pastProcesses: pastList,
          });
        });
        dispatch({ type: "SET_LOADING", loading: false });
      },
      selectProcess: (selectedProcessId: any) => {
        dispatch({ type: "SET_LOADING", loading: true });
        WebService.fetchSingleProcess(selectedProcessId).subscribe(async (data: any) => {
          const process = await data;
          dispatch({ type: "SET_SELECTED_PROCESS", selectedProcess: process });
        });
        dispatch({ type: "SET_LOADING", loading: false });
      },
      stageTransfer: (transfer: any) => {
        dispatch({
          type: "SET_TRANSFER",
          transfer: transfer,
        });
      },
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <ActionContext.Provider value={actionContext}>
      <StateContext.Provider value={state}>{props.children}</StateContext.Provider>
    </ActionContext.Provider>
  );
};
