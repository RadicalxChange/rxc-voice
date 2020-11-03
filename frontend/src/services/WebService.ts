import { Observable, defer, from } from "rxjs";
import { Election } from "../models/Election";
import { Proposal } from "../models/Proposal";
import { mapToProposals } from "../utils";

const ROOT_URL = "http://127.0.0.1:8000";

export const fetchElection = (id: string): Observable<Election> => {
  return defer(() => {
    return from<Promise<Election>>(
      fetch(`${ROOT_URL}/elections/${id}/`).then((res) => res.json()),
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
