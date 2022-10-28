import { createAction, createAsyncAction, ActionType, createReducer } from "typesafe-actions";
import { takeEvery, put } from "redux-saga/effects";
import createAsyncSaga, { createAsyncReducer, transformToArray } from "../util/reducerUtils";
import { getAccessToken, GetAccessTokenParam, reIssueTokens, ReIssueTokensaram } from "../../logics/auth";
import { setRefreshToken } from "../../cookie/cookie";
import { getInfoFromToken, InfoFromToken } from "../../util/appUtils";


////////////////////////////////////////////////////////////action
// sign in
export const SIGN_IN_ACTION = "app/SIGN_IN_ACTION";
export const SIGN_IN_SUCCESS_ACTION = "app/SIGN_IN_SUCCESS_ACTION";
export const SIGN_IN_ERROR_ACTION = "app/SIGN_IN_ERROR_ACTION";
export const signInAsyncAction = createAsyncAction(
    // action.type
    SIGN_IN_ACTION,
    SIGN_IN_SUCCESS_ACTION,
    SIGN_IN_ERROR_ACTION
    // result types
)<GetAccessTokenParam, Object, Error>();

// sign out
export const SIGN_OUT_ACTION = "app/SIGN_OUT_ACTION";
export const signOutAction = createAction(SIGN_OUT_ACTION)<string | null>();

// set tokens
export const SET_TOKENS_ACTON = "app/SET_TOKENS_ACTON";
export const setTokenInfoAction = createAction(SET_TOKENS_ACTON)<SetTokensActionParam>();

// reissue
export const REISSUE_ACTION = "app/REISSUE_ACTION";
export const REISSUE_SUCCESS_ACTION = "app/REISSUE_SUCCESS_ACTION";
export const REISSUE_ERROR_ACTION = "app/REISSUE_ERROR_ACTION";
export const reIssueAsyncAction = createAsyncAction(
    // action.type
    REISSUE_ACTION,
    REISSUE_SUCCESS_ACTION,
    REISSUE_ERROR_ACTION
    // result types
)<ReIssueTokensaram, Object, Error>();


////////////////////////////////////////////////////////////type
const actions = { signInAsyncAction, signOutAction, setTokenInfoAction, reIssueAsyncAction };
export type AppAction = ActionType<typeof actions>
export type AppState = {
    signInAsyncAction: any,
    reIssueAsyncAction: any,
    accessToken: string,
    refreshToken: string,
    grantType: string,
    userInfoFromToken: InfoFromToken,
}
// action params
export type SetTokensActionParam = {
    accessToken: string,
    refreshToken: string,
    grantType: string,
    userInfoFromToken: InfoFromToken 
}
export type TokenIssuedSuccessfullyResult = {
    accessToken: string,
    grantType: string,
    refreshToken: string
}

////////////////////////////////////////////////////////////reducer
const initialState: AppState = {
    signInAsyncAction: null,
    reIssueAsyncAction: null,

    accessToken: "",
    refreshToken: "",
    grantType: "",
    userInfoFromToken: null,
};

const app = createReducer<AppState, AppAction>(initialState)
    // Async 호출 패턴
    .handleAction(
        transformToArray(signInAsyncAction),
        createAsyncReducer(signInAsyncAction, "signInAsyncAction")
    )
    .handleAction(
        transformToArray(reIssueAsyncAction),
        createAsyncReducer(reIssueAsyncAction, "signInAsyncAction")
    )

    // 단순 store 조작
    .handleAction(setTokenInfoAction, (state, action) => {
        return {
            ...state,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken,
            grantType: action.payload.grantType,
            userInfoFromToken: action.payload.userInfoFromToken
        }
    })


////////////////////////////////////////////////////////////saga
export function* appSaga() {

    yield takeEvery(SIGN_IN_ACTION, createAsyncSaga(signInAsyncAction, getAccessToken));
    yield takeEvery(SIGN_IN_SUCCESS_ACTION, signInSuccessSaga);

    yield takeEvery(REISSUE_ACTION, createAsyncSaga(reIssueAsyncAction, reIssueTokens));
    yield takeEvery(REISSUE_SUCCESS_ACTION, reIssueSuccessSaga);
}
// inner saga function
function processAfterTokenIssued(result: TokenIssuedSuccessfullyResult) {
    // const result = action.payload as TokenIssuedSuccessfullyResult;
    const token = result.accessToken;
    // const base64Payload = token.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    // const payload = Buffer.from(base64Payload, 'base64');
    const userInfo: InfoFromToken = getInfoFromToken(token);
    console.log('jwt infos::', userInfo);
    // const refreshToken = result.grantType + ' ' + result.refreshToken;
    const refreshToken = result.refreshToken;
    // const accessToken = result.grantType + ' ' + result.accessToken;
    const accessToken = result.accessToken;
    const grantType = result.grantType;

    // 쿠키저장
    setRefreshToken(refreshToken)
    // setTimeout(()=>(dispatch(reIssueAsyncAction.request({accessToken:accessToken,refreshToken:refreshToken}))), 3000);
    // store 저장
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        grantType: grantType,
        userInfoFromToken: userInfo
    } as SetTokensActionParam
}
function* signInSuccessSaga(action: ReturnType<typeof signInAsyncAction.success>) {
    console.log('signInSuccessSaga action::', action)
    yield put(setTokenInfoAction(processAfterTokenIssued(action.payload as TokenIssuedSuccessfullyResult)))
}
function* reIssueSuccessSaga(action: ReturnType<typeof reIssueAsyncAction.success>) {
    console.log('reIssueSuccessSaga action::', action)
    yield put(setTokenInfoAction(processAfterTokenIssued(action.payload as TokenIssuedSuccessfullyResult)))
}

export default app;