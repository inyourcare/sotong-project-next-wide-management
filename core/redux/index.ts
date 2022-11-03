import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
// import firebase, { firebaseSaga } from "./firebase";
// import twilio, { twilioSaga } from "./twilio";
// import smoothy from "./smoothy";
// import test from "./test";
import app, { appSaga } from "./reducers/app-reducer";
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

// const reducers = { firebase, twilio, test, smoothy };
// const rootReducer = combineReducers(reducers);

// export function* rootSaga() {
//   yield all([firebaseSaga(), twilioSaga()]);
// }

//////////////////
const sagaMiddleware = createSagaMiddleware();
// const makeStore = () =>
//   configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//       serializableCheck: false,
//     }).concat(logger).concat(sagaMiddleware),
//   })

const reducers = { app };
const rootReducer = combineReducers(reducers);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(logger).concat(sagaMiddleware),
})
sagaMiddleware.run(rootSaga);

export function* rootSaga() {
    yield all([appSaga()]);
}
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
