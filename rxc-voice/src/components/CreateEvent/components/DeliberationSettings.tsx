import React, { useState } from "react";
import moment from "moment";
import Datetime from "react-datetime";
import { Conversation } from "../../../models/Stage";
import hideIcon from "../../../assets/icons/hide.svg";
import showIcon from "../../../assets/icons/show.svg";
import upArrow from "../../../assets/icons/up_arrow.svg";
import downArrow from "../../../assets/icons/down_arrow.svg";
import xIcon from "../../../assets/icons/x_icon.svg";

function DeliberationSettings(props: {settings: Conversation, numStages: number, reducer: any}) {
  const [show, setShow] = useState(true);

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
      </div>
      {show ? (
        <>
        <label>Conversation</label>
        <p>Choose the settings for the Conversation Stage</p>
        <div className="event-section">
          <label>Conversation Stage Title</label>
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
          <label>Deliberation Start Date</label>
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
          <label>Deliberation End Date</label>
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

export default DeliberationSettings;
