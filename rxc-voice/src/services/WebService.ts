import { Observable, defer, from } from "rxjs";
import { Election } from "../models/Election";
import { Process } from "../models/Process";
import { Proposal } from "../models/Proposal";
import { Delegate } from "../models/Delegate";
// import { Transfer } from "../models/Transfer";
import { Vote } from "../models/Vote";
import { mapToProcesses, mapToProposals, mapToVotes, mapToDelegates } from "../utils";

const ROOT_URL = "http://127.0.0.1:8000";

export const loginUser = (user: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/api-token-auth/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(user),
      }),
    );
  });
};

export const modifyUser = (moddata: any, id: string): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/delegates/${id}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
         },
        method: "PUT",
        body: JSON.stringify(moddata),
      }),
    );
  });
};

export const fetchDelegates = (): Observable<Delegate[]> => {
  return defer(() => {
    return from<Promise<Delegate[]>>(
      fetch(`${ROOT_URL}/delegates/`)
        .then((res) => res.json())
        .then(mapToDelegates),
    );
  });
};

export const postDelegates = (users: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/delegates/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(users),
      }),
    );
  });
};

export const fetchProcesses = (): Observable<Process[]> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<Process[]>>(
      fetch(`${ROOT_URL}/processes/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        }
      }).then((res) => res.json())
        .then(mapToProcesses),
    );
  });
};

export const fetchElection = (id: string): Observable<Election> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<Election>>(
      fetch(`${ROOT_URL}/elections/${id}/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "GET",
      }).then((res) => res.json()),
    );
  });
};

// export const postElection = (election: any): Observable<any> => {
//   return defer(() => {
//     return from<Promise<any>>(
//       fetch(`${ROOT_URL}/elections/`, {
//         headers: { "Content-Type": "application/json; charset=utf-8" },
//         method: "POST",
//         body: JSON.stringify(election),
//       }),
//     );
//   });
// };

export const fetchProposals = (election_id: string): Observable<Proposal[]> => {
  return defer(() => {
    return from<Promise<Proposal[]>>(
      fetch(`${ROOT_URL}/elections/${election_id}/proposals/`)
        .then((res) => res.json())
        .then(mapToProposals),
    );
  });
};

// export const postProposals = (proposals: any, election_id: number): Observable<any> => {
//   return defer(() => {
//     return from<Promise<any>>(
//       fetch(`${ROOT_URL}/elections/${election_id}/proposals/`, {
//         headers: { "Content-Type": "application/json; charset=utf-8" },
//         method: "POST",
//         body: JSON.stringify(proposals),
//       }),
//     );
//   });
// };

export const fetchVotes = (election_id: string): Observable<Vote[]> => {
  return defer(() => {
    return from<Promise<Vote[]>>(
      fetch(`${ROOT_URL}/elections/${election_id}/votes/`)
        .then((res) => res.json())
        .then(mapToVotes),
    );
  });
};

export const postVotes = (votes: any, election_id: number): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/${election_id}/votes/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(votes),
      }),
    );
  });
};

export const postTransfer = (transfers: any, recipient_id: number): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/delegates/${recipient_id}/transfers/`, {
        headers: { "Content-Type": "application/json; charset=utf-8", 
        Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify(transfers),
      }),
    );
  });
};
