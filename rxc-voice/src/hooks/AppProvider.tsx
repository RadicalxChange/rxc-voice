import moment from "moment";
import React, { createContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { BgColor } from "../models/BgColor";
import { Process } from "../models/Process";
import { WebService } from "../services";

const yellowColor = "var(--yellowColor)";
const whiteColor = "var(--whiteColor)";

const actionInitialValue = {
  setColor: (color: BgColor) => {},
  logoutUser: () => {},
  // updateUser: (id: string, updatedUser: any) => {},
  setUserData: (user: any) => {},
  selectProcess: (selectedProcess: any) => {},
  fetchProcesses: () => {},
};
const stateInitialValue = {
  color: yellowColor,
  user: null,
  processes: [],
  activeProcesses: [],
  pastProcesses: [],
  selectedProcess: null,
};
export const ActionContext = createContext(actionInitialValue);
export const StateContext = createContext(stateInitialValue);

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
      }
    }, {
      color: yellowColor,
      user: sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")!)
        : null,
      processes: [],
      activeProcesses: [],
      pastProcesses: [],
      selectProcess: null,
    }
  );

  const actionContext = useMemo(
    () => ({
      setColor: (color: BgColor) => {
        switch (color) {
          case BgColor.Yellow: {
            dispatch({ type: "SET_COLOR", color: yellowColor });
            break;
          }
          case BgColor.White: {
            dispatch({ type: "SET_COLOR", color: whiteColor });
            break;
          }
        }
      },
      setUserData: (user: any) => {
        console.log("appprovider: setting user data..." + user)
        sessionStorage.setItem("user", JSON.stringify(user));
        dispatch({
          type: "SET_USER",
          user: user,
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
      // updateUser: async (id: string, updatedUser: any) => {
      //   WebService.updateUser(id, updatedUser)
      //     .pipe(catchError((err) => of(`I caught: ${err}`)))
      //     .subscribe(async (data) => {
      //       if (data.ok) {
      //         const user = await data.json();
      //         sessionStorage.setItem("user", JSON.stringify(user));
      //         dispatch({
      //           type: "SET_USER",
      //           user,
      //         });
      //       } else {
      //         console.error("Error", await data.json());
      //       }
      //     });
      // },
      fetchProcesses: () => {
        WebService.fetchProcesses().subscribe((data: any) => {
          var activeList: Process[] = new Array<Process>();
          var pastList: Process[] = new Array<Process>();
          data.forEach((process: Process) => {
            if (moment(process.end_date) > moment()) {
              activeList.push(process);
            } else {
              pastList.push(process);
            }
          });
          dispatch({
            type: "SET_PROCESS_LIST",
            processes: data,
            activeProcesses: activeList,
            pastProcesses: pastList,
          });
        });
      },
      selectProcess: (selectedProcess: any) => {
        dispatch({
          type: "SET_SELECTED_PROCESS",
          selectedProcess: selectedProcess
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
