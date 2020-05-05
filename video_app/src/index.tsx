import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { configureStore, history } from "./configureStore";

import routes from './routes';
import {initializeDispatchAndState} from "./listeners/addPeerAndRoomListeners";

const store = configureStore();
initializeDispatchAndState(store.dispatch);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>{routes}</ConnectedRouter>
    </Provider>,
    document.getElementById('root'));
