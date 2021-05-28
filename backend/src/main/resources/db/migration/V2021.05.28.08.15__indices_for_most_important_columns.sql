CREATE INDEX event_history_created_date ON event_history (created_date);
CREATE INDEX event_history_project_id ON event_history (project_id);

CREATE INDEX event_section_id ON event (section_id);

CREATE INDEX invitation_jhi_user_id ON invitation (jhi_user_id);
CREATE INDEX invitation_project_id ON invitation (project_id);

CREATE INDEX location_project_id ON location (project_id);

CREATE INDEX responsibility_project_id ON responsibility (project_id);

CREATE INDEX section_location_id ON section (location_id);
