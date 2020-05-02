import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";

import { State, rootReducer } from "./reducers";
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from "./sagas";

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();

export function configureStore(preloadedState?: State) {
    const middlewares = [routerMiddleware(history), sagaMiddleware, logger];
    const middlewareEnhancer = applyMiddleware(...middlewares);
    const store = createStore(rootReducer(history), preloadedState, middlewareEnhancer);
    sagaMiddleware.run(rootSaga);
    return store;
}
