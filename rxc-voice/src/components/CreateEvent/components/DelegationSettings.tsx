import React from "react";
import moment from "moment";
import Datetime from "react-datetime";
import { Delegation, MatchPoolMode } from "../../../models/Stage";

function DelegationSettings(props: {settings: Delegation, reducer: any}) {

  const changeAllowTransfers = (value: boolean) => {
    props.reducer({
      id: props.settings.id,
      field: "allow_transfers",
      value: value,
    })
    props.reducer({
      id: props.settings.id,
      field: "matching_pool",
      value: value ? MatchPoolMode.Default : MatchPoolMode.None,
    })
  };

  return (
    <div className="event-section">
      <label>Delegation</label>
      <p>Choose the settings for the Delegation Stage</p>
      <div className="event-section">
        <label>Voice Credits per Voter</label>
        <p>How many voice credits should each delegate start with?</p>
        <div className="event-section_form">
          <input
            id="num-credits_input"
            className="event-section_form_input"
            type="number"
            min="1"
            step="1"
            value={props.settings.num_credits}
            onChange={(e) => props.reducer({
              id: props.settings.id,
              field: "num_credits",
              value: e.target.value,
            })}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Liquid Democracy</label>
        <p>By default, delegates have the option to transfer any number of their voice credits to others in the group. Allow voice credit transfers?</p>
        <div className="event-section_form">
        <label className="event-section_form_input">
          <input
            id="allow-transfers_input"
            className="checkbox-button"
            type="checkbox"
            checked={props.settings.allow_transfers}
            onChange={() => changeAllowTransfers(!props.settings.allow_transfers)}
          />Allow voice credit transfers
          </label>
        </div>
      </div>
      <div className="event-section">
        <label>Voice Credit Matching Fund</label>
        <p>By default, voice credit transfers are matched according to the Quadratic Funding (QF) formula. You can set a limit on the amount of voice credits in the matching pool, or turn off this feature completely.</p>
        <div id="match-pool-radio" className="event-section_form">
          <label className="event-section_form_input">
            <input
              type="radio"
              className="checkbox-button"
              name="match_pool_mode"
              value={MatchPoolMode.Infinite}
              checked={props.settings.matching_pool === MatchPoolMode.Infinite}
              disabled={!props.settings.allow_transfers}
              onChange={(e) => props.reducer({
                id: props.settings.id,
                field: "matching_pool",
                value: e.target.value,
              })}
            />
            Infinite (no limit)
          </label>
          <label className="event-section_form_input">
            <input
              type="radio"
              className="checkbox-button"
              name="match_pool_mode"
              value={MatchPoolMode.Default}
              checked={props.settings.matching_pool === MatchPoolMode.Default}
              disabled={!props.settings.allow_transfers}
              onChange={(e) => props.reducer({
                id: props.settings.id,
                field: "matching_pool",
                value: e.target.value,
              })}
            />
            Default (voice credits per delegate * number of delegates)
          </label>
          <label className="event-section_form_input">
            <input
              type="radio"
              className="checkbox-button"
              name="match_pool_mode"
              value={MatchPoolMode.None}
              checked={props.settings.matching_pool === MatchPoolMode.None}
              disabled={!props.settings.allow_transfers}
              onChange={(e) => props.reducer({
                id: props.settings.id,
                field: "matching_pool",
                value: e.target.value,
              })}
            />
            None (Turn off QF matching)
          </label>
        </div>
      </div>
      <div className="event-section">
        <label>Open Delegation</label>
        <p>By default, delegates have the option to invite new people into the event by sending voice credits to their email address. Allow delegates to invite new people?</p>
        <div className="event-section_form">
          <label className="event-section_form_input">
            <input
              id="allow-invites_input"
              className="checkbox-button"
              type="checkbox"
              checked={props.settings.allow_invites}
              onChange={() => props.reducer({
                id: props.settings.id,
                field: "allow_invites",
                value: !props.settings.allow_invites,
              })}
            />Delegates can send invites
          </label>
        </div>
      </div>
      <div className="event-section">
        <label>Delegation Start Date</label>
        <p>When would you like this stage to begin?</p>
        <div className="event-section_form">
          <Datetime
            className="event-section_datetime"
            value={moment(props.settings.start_date)}
            onChange={(value) => props.reducer({
              id: props.settings.id,
              field: "start_date",
              value: value,
            })}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Delegation End Date</label>
        <p>When would you like this stage to end?</p>
        <div className="event-section_form">
          <Datetime
            className="event-section_datetime"
            value={moment(props.settings.end_date)}
            onChange={(value) => props.reducer({
              id: props.settings.id,
              field: "end_date",
              value: value,
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default DelegationSettings;
