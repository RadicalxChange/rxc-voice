import { Observable, defer, from } from "rxjs";

const ROOT_URL = "http://127.0.0.1:8000";

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

export const postProposal = (proposal: any, election_id: number): Observable<any> => {
  return defer(() => {
    return from<Promise<any>>(
      fetch(`${ROOT_URL}/elections/${election_id}/proposals`, {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: "POST",
        body: JSON.stringify(proposal),
      }),
    );
  });
};
