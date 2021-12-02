import React, { useContext, useEffect, useReducer, useState } from "react";
import moment from "moment";
import Datetime from "react-datetime";
import { ActionContext } from "../../hooks";
import { BgColor } from "../../models/BgColor";
import { Group } from "../../models/Group";
import { Stage, StageType } from "../../models/Stage";
import { User } from "../../models/User";
import { WebService } from "../../services";
import { defaultStages, Domain, getUserData } from "../../utils";
import DelegationSettings from "./components/DelegationSettings";
import DeliberationSettings from "./components/DeliberationSettings";
import ElectionSettings from "./components/ElectionSettings";

import "./CreateEvent.scss";

export interface Change {
  id: number,
  field: string,
  value: any,
}

function CreateEvent() {
  const { setColor, setUserData } = useContext(ActionContext);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("")
  const [eventStartDate, setEventStartDate] = useState(moment().format());
  const [eventEndDate, setEventEndDate] = useState(moment().add(4, "days").format());
  const [groups, setGroups] = useState(new Array<Group>())
  const [newGroup, setNewGroup] = useState("");
  const [existingGroup, setExistingGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState(new Array<string>());
  const [invites, setInvites] = useState("");
  const [invitationMessage, setInvitationMessage] = useState("")

  function stageReducer(stages: Stage[], change: Change) {
    stages = stages.map((stage: Stage) => {
      if (stage.id === change.id) {
        stage = {
          ...stage,
          [change.field]: change.value,
        }
      }
      return stage;
    });
    return stages;
  };
  const [stages, stageDispatch] = useReducer(stageReducer, defaultStages);

  useEffect(() => {
    setColor(BgColor.White);
    const user: User | undefined = getUserData();
    if (user) {
      WebService.fetchGroups(user.user_id)
      .subscribe((data: Group[]) => {
        setGroups(data);
      });
    }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 const changeExistingGroup = (groupId: string) => {
   setExistingGroup(groupId);
   const group = groups.find((group: Group) => {
     return group.id === +groupId;
   });
   setGroupMembers(group ? group.users : []);
 };

 const createEvent = (e: any) => {
   e.preventDefault()
   let eventGroup = groups.find((group: Group) => {
     return group.id === +existingGroup;
   });
   const eventData = {
     process: {
       title: eventTitle,
       description: eventDescription,
       invitation_message: invitationMessage,
       start_date: eventStartDate,
       end_date: eventEndDate,
       groups: eventGroup ? [eventGroup.id] : [],
     },
     group: {
       create: newGroup === "true" ? true : false,
       name: newGroupName,
     },
     invites: invites.split("\n").map((email: string) => ({
       credit_balance: stages.map((stage: Stage): any => {
         return stage;
       })[0].num_credits,
       profile: {
         user: {
           username: email,
           email: email,
           first_name: "",
           last_name: "",
           password: "email",
           groups: []
         }
       }
     })),
     stages: stages,
   }
   WebService.postProcess(eventData).subscribe(async (data) => {
     if (data.ok) {
       const response = await data.json();
       const user: User | undefined = getUserData();
       if (user) {
         let updatedUserData: User = user;
         updatedUserData.delegates = response.user_delegates;
         setUserData(updatedUserData);
       }
       window.location.href = Domain.WEB;
     } else {
       const error = await data.json();
       Object.keys(error).forEach((key) => {
         console.log(error[key]);
       });
     }
   });
 };

 const renderSettings = (stage: any) => {
   switch (stage.type) {
     case StageType.Delegation:
       return <DelegationSettings key={stage.id} settings={stage} reducer={stageDispatch} />
     case StageType.Conversation:
       return <DeliberationSettings key={stage.id} settings={stage} reducer={stageDispatch} />
     case StageType.Election:
       return <ElectionSettings key={stage.id} settings={stage} reducer={stageDispatch} />
   }
 };

  return (
    <form className="create-event" onSubmit={createEvent}>
      <div className="create-event_header">
        <h1>Create a new Event</h1>
        <p>Fill out the information below to create your event.</p>
      </div>
      <h2>General Information</h2>
      <p>Fill out the general information for this event.</p>
      <div className="event-section">
        <label>Event Title</label>
        <p>Add a title to this event.</p>
        <div className="event-section_form">
          <input
            type="text"
            id="stage_title"
            className="event-section_form_input"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Event Description</label>
        <p>Add a description to this event.</p>
        <div className="event-section_form">
          <textarea
            id="invitation-message"
            className="event-section_form_input"
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Event Start Date</label>
        <p>When would you like this event to begin?</p>
        <div className="event-section_form">
          <Datetime
            className="event-section_datetime"
            value={moment(eventStartDate)}
            onChange={(value) => setEventStartDate(moment(value).format())}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Event End Date</label>
        <p>When would you like this event to end?</p>
        <div className="event-section_form">
          <Datetime
            className="event-section_datetime"
            value={moment(eventEndDate)}
            onChange={(value) => setEventEndDate(moment(value).format())}
          />
        </div>
      </div>
      <div className="event-section">
        <label>Group</label>
        <p>Which group is participating in this event?</p>
        <div className="event-section_form checkbox-form">
          <input type="radio" className="checkbox-button" name="new_group" value="false" onChange={(e) => setNewGroup(e.target.value)} />
          {newGroup === "false" ? (
            <select
              id="existing-group_select"
              className="event-section_form_input"
              defaultValue=""
              onChange={(e) => changeExistingGroup(e.target.value)}
            >
              <option value="" disabled hidden>
                Select an existing group
              </option>
              {groups.length ? (
                groups.map((group: Group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))
              ) : null}
            </select>
          ) : (
            <select
              id="existing-group_select"
              className="event-section_form_input"
              defaultValue=""
              onChange={(e) => changeExistingGroup(e.target.value)}
              disabled
            >
              <option value="" disabled hidden>
                Select an existing group
              </option>
              {groups.length ? (
                groups.map((group: Group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))
              ) : null}
            </select>
          )}
        </div>
        <div className="event-section_form checkbox-form">
          <input type="radio" className="checkbox-button" name="new_group" value="true" onChange={(e) => setNewGroup(e.target.value)} />
          {newGroup === "true" ? (
            <input
              id="new-group_input"
              className="event-section_form_input"
              type="text"
              placeholder="Create a new group"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          ) : (
            <input
              id="new-group_input"
              className="event-section_form_input"
              type="text"
              placeholder="Create a new group"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              disabled
            />
          )}
        </div>
      </div>
      <div className="event-section">
        <label>Invitations</label>
        <p>Invite people by email address. Current members of the group are invited automatically.</p>
        <div className="event-section_form">
          {newGroup === "false" && existingGroup ? (
            <label>Current Group Members
              <textarea
                id="existing-group_select_users"
                className="event-section_form_input select-invites"
                value={groupMembers.join("\n")}
                readOnly
              />
            </label>
          ) : null}
          <label>Invite New Participants
            <textarea
              id="new-invites_select_users"
              className="event-section_form_input select-invites"
              placeholder="Add email addresses here, separated by newlines"
              value={invites}
              onChange={(e) => setInvites(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="event-section">
        <label>Invitation Message</label>
        <p>Customize the invitation message that will be sent to all of the participants.</p>
        <div className="event-section_form">
          <textarea
            id="invitation-message"
            className="event-section_form_input"
            placeholder={"Welcome to RxC Voice -- we want to invite you to participate in the following collective decision: " + eventTitle}
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
          />
        </div>
      </div>
      <h2>Event Settings</h2>
      <p>Choose the settings for each stage of this event.</p>
      {stages.map((stage: Stage) => (
        renderSettings(stage)
      ))}
      <button
        type="submit"
        >
        Create Event
      </button>
    </form>
  );
}

export default CreateEvent;
