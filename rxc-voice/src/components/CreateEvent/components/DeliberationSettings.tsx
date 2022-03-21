import React from "react";
import moment from "moment";
import Datetime from "react-datetime";
import { Conversation } from "../../../models/Stage";

function DeliberationSettings(props: {settings: Conversation, reducer: any}) {

  return (
    <div className="event-section">
      <label>Deliberation</label>
      <p>Choose the settings for the Deliberation Stage</p>
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

export default DeliberationSettings;
