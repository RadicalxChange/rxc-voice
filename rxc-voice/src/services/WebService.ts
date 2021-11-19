import { Observable, defer, from } from "rxjs";
import { Election } from "../models/Stage";
import { Process } from "../models/Process";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { mapToProcesses, mapToVotes, mapToProcess, Domain } from "../utils";

const ROOT_URL = Domain.API;

export const loginUser = (data: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/api-token-auth/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  });
};

export const forgotPassword = (data: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/forgot-password/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  });
};

export const resetPassword = (data: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/reset-password/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  });
};

export const modifyUser = (moddata: any, id: number): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/users/${id}/`, {
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

export const modifyProfile = (moddata: any, id: number): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/profiles/${id}/`, {
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

export const createProfile = (data: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/profile/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(data),
      }),
    );
  });
};

export const getDelegate = (id: string): Observable<any> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/delegates/${id}/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        }
      })
    );
  });
};

export const validateToken = (creds: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/activate/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(creds),
      }),
    );
  });
};

// export const fetchDelegates = (): Observable<Delegate[]> => {
//   return defer(() => {
//     return from<Promise<Delegate[]>>(
//       fetch(`${ROOT_URL}/delegates/`)
//         .then((res) => res.json())
//         .then(mapToDelegates),
//     );
//   });
// };

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

export const fetchSingleProcess = (id: string): Observable<any> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<Process>>(
      fetch(`${ROOT_URL}/processes/${id}/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        }
      }).then((res) => res.json())
        .then(mapToProcess),
    );
  });
};

export const postProcess = (process: any): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/processes/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify(process),
      }),
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

export const fetchProposals = (election_id: number): Observable<Proposal[]> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<Proposal[]>>(
      fetch(`${ROOT_URL}/elections/${election_id}/proposals/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "GET",
      }).then((res) => res.json())
    );
  });
};

export const fetchVotes = (election_id: number): Observable<Vote[]> => {
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
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/${election_id}/votes/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify(votes),
      }),
    );
  });
};

export const postTransfer = (transfer: any): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/processes/${transfer.process}/transfers/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify(transfer),
      }),
    );
  });
};

export const estimateMatch = (transfer: any): Observable<any> => {
  const user: string | null = sessionStorage.getItem("user");
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/estimate-match/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify(transfer),
      })
    );
  });
};

export const fetchTransfers = (process_id: number): Observable<any> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/processes/${process_id}/transfers/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "GET",
      }).then((res) => res.json())
    );
  });
};

export const verifyGithub = (creds: any): Observable<any> => {
    return defer(() => {
      const user: string | null = sessionStorage.getItem("user");
      return from<Promise<any>>(
        fetch(`${ROOT_URL}/github/verify/`, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
         },
          method: "POST",
          body: JSON.stringify({
            'code': creds.code,
            'state': creds.state,
            }),
        }),
      );
    });
};

export const getTwitterRequestToken = (): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/twitter/token/`)
        .then((res) => res.json())
    );
  });
};

export const emailApplication = (): Observable<any> => {
  return defer(() => {
    const user: string | null = sessionStorage.getItem("user");
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/email-application/`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
        },
        method: "POST",
        body: JSON.stringify({}),
      })
    );
  });
};

export const getTwitterAccessToken = (creds: any): Observable<any> => {
    return defer(() => {
      const user: string | null = sessionStorage.getItem("user");
      return from<Promise<any>>(
        fetch(`${ROOT_URL}/twitter/token/`, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            Authorization: `Token ${user ? JSON.parse(user).token : ''}`,
         },
          method: "POST",
          body: JSON.stringify({
            'oauth_token': creds.oauth_token,
            'oauth_verifier': creds.oauth_verifier,
            'oauth_secret': creds.oauth_secret,
            }),
        }),
      );
    });
};
