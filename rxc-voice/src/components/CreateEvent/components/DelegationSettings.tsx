import React, { useState } from "react";
import moment from "moment";
import Datetime from "react-datetime";
import { Delegation, MatchPoolMode } from "../../../models/Stage";
import hideIcon from "../../../assets/icons/hide.svg";
import showIcon from "../../../assets/icons/show.svg";
import upArrow from "../../../assets/icons/up_arrow.svg";
import downArrow from "../../../assets/icons/down_arrow.svg";
import xIcon from "../../../assets/icons/x_icon.svg";

function DelegationSettings(props: {settings: Delegation, numStages: number, reducer: any}) {
  const [show, setShow] = useState(true);
  const required = props.settings.position === 0;

  // if allow_transfers is false, matching_pool must be set to None
  const changeAllowTransfers = (value: boolean) => {
    props.reducer({
      type: "edit",
      id: props.settings.id,
      field: "allow_transfers",
      value: value,
    })
    props.reducer({
      type: "edit",
      id: props.settings.id,
      field: "matching_pool",
      value: value ? MatchPoolMode.Default : MatchPoolMode.None,
    })
  };

  return (
    <div className="event-section">
      <div className="stage-buttons-container">
        <button
          type="button"
          className="text-button"
          onClick={() => setShow(!show)}
        >
          <img src={show ? hideIcon : showIcon} alt={show ? "hide icon" : "show icon"} />
        </button>
        {!required ? (
          <>
          <button
            type="button"
            className="text-button"
            onClick={() => props.reducer({
              type: "moveUp",
              id: props.settings.id,
              value: props.settings,
            })}
            disabled={props.settings.position === 1}
          >
            <img src={upArrow} alt="up arrow" />
          </button>
          <button
            type="button"
            className="text-button"
            onClick={() => props.reducer({
              type: "moveDown",
              id: props.settings.id,
              value: props.settings,
            })}
            disabled={props.settings.position === props.numStages - 2}
          >
            <img src={downArrow} alt="down arrow" />
          </button>
          <button
            type="button"
            className="text-button"
            onClick={(e) => props.reducer({
              type: "remove",
              id: props.settings.id,
            })}
          >
            <img src={xIcon} alt="delete button" />
          </button>
          </>
        ) : null}
      </div>
      {show ? (
        <>
        <label>Delegation</label>
        <p>Choose the settings for the Delegation Stage</p>
        <div className="event-section">
          <label>Delegation Stage Title</label>
          <p>Add a custom title to this stage.</p>
          <div className="event-section_form">
            <input
              type="text"
              id="stage_title"
              className="event-section_form_input"
              value={props.settings.title}
              onChange={(e) => props.reducer({
                type: "edit",
                id: props.settings.id,
                field: "title",
                value: e.target.value,
              })}
            />
          </div>
        </div>
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
                type: "edit",
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
                  type: "edit",
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
                  type: "edit",
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
                  type: "edit",
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
                  type: "edit",
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
                type: "edit",
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
                type: "edit",
                id: props.settings.id,
                field: "end_date",
                value: value,
              })}
            />
          </div>
        </div>
        </>
      ) : (
        <label>{props.settings.title}</label>
      )}
    </div>
  );
}

export default DelegationSettings;
