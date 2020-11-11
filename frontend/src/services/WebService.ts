import { Observable, defer, from } from "rxjs";
import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";
import { Vote } from "../models/Vote";
import { Voter } from "../models/Voter";
import { mapToProposals, mapToVotes, mapToVoters } from "../utils";

const ROOT_URL = "http://127.0.0.1:8000";

// export const accessElection = (id: string): Observable<any> => {
//   return defer(() => {
//     return from<Promise<any>>(
//       fetch(`${ROOT_URL}/anon-voters/${id}/`).then((res) => res.json()),
//     );
//   });
// };

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


export const updateVoter = (id: string, voter: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/anon-voters/${id}/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "PUT",
        body: JSON.stringify(voter),
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

export const postElection = (election: any): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(election),
      }),
    );
  });
};

export const fetchProposals = (election_id: string): Observable<Proposal[]> => {
  return defer(() => {
    return from<Promise<Proposal[]>>(
      fetch(`${ROOT_URL}/elections/${election_id}/proposals/`)
        .then((res) => res.json())
        .then(mapToProposals),
    );
  });
};

export const postProposals = (proposals: any, election_id: number): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/${election_id}/proposals/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(proposals),
      }),
    );
  });
};

export const fetchVoters = (election_id: string): Observable<Voter[]> => {
  return defer(() => {
    return from<Promise<Voter[]>>(
      fetch(`${ROOT_URL}/elections/${election_id}/anon-voters/`)
        .then((res) => res.json())
        .then(mapToVoters),
    );
  });
};

export const postVoters = (voters: any, election_id: number): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/${election_id}/anon-voters/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(voters),
      }),
    );
  });
};

export const postUsers = (users: any, election_id: number): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/users/`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(users),
      }),
    );
  });
};

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
