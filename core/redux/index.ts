import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
// import firebase, { firebaseSaga } from "./firebase";
// import twilio, { twilioSaga } from "./twilio";
// import smoothy from "./smoothy";
// import test from "./test";
import app, { appSaga } from "./reducers/app-reducer";

// const reducers = { firebase, twilio, test, smoothy };
// const rootReducer = combineReducers(reducers);

// export function* rootSaga() {
//   yield all([firebaseSaga(), twilioSaga()]);
// }

const reducers = { app };
const rootReducer = combineReducers(reducers);

export function* rootSaga() {
    yield all([appSaga()]);
}
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
