import { combineReducers } from 'redux';
import { messagesReducer } from './messages.reducer';
import { projectsReducer } from './projects.reducer';

export default combineReducers({ messages: messagesReducer, projects: projectsReducer });
