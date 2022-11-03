import { getCookieToken } from '@core/cookie';
import { store } from '@core/redux';
import { reIssueAsyncAction } from '@core/redux/reducers/app-reducer';
import { getInfoFromToken } from '@core/util/appUtils';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { Context } from 'vm';
// import { store } from '../../pages/_app';
// const auth = 'Bearer ' + state.accessToken
const header = {
    'Content-Type': 'application/json',
    // 'Authorization': auth,
    // credentials: 'include',
    'Access-Control-Expose-Headers': '*',
    // 'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json',
}

const apiHost = "http://localhost:8080/";
// const apiHost = "s5xen.iptime.org:40011/";
// export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
//     (store) => async (context: Context) => {
//         const props = store.getState().app
        
//         await store.dispatch(getAccessToken("",""));
//         return {
//             props: {}, // will be passed to the page component as props
//         };
//     }
// );


export type GetAccessTokenParam = {
    userId: string,
    password: string
}
export const getAccessToken = (param: GetAccessTokenParam): any => {
    const apiName = "rest/common/auth/signIn"
    console.log('getAccessToken param::', param)
    if (param.userId && param.password) {
        const params = { signInId: param.userId, password: param.password }
        return axios({
            method: 'post',
            url: apiHost + apiName,
            headers: header,
            data: JSON.stringify(params)
        })
            .then(response => {
                console.log('getAccessToken response::', response)
                return response.data
            })
            .catch((e) => {
                console.log('getAccessToken error::', e)
                throw e;
                // return e;
            })
    }
    // if (param.userId && param.password) {
    //     const params = { signInId: param.userId, password: param.password }
    //     return fetch(apiHost + apiName, {
    //         method: 'POST',
    //         headers: header,
    //         body: JSON.stringify(params)
    //     })
    //         .then(response => {
    //             console.log('getAccessToken response::', response)
    //             if (response.ok)
    //                 return response.json()
    //             else
    //                 throw Error('response not ok')
    //         })
    //         .catch((e) => {
    //             console.log('getAccessToken error::', e)
    //             throw e;
    //             // return e;
    //         })
    // }
    throw Error('getAccessToken param is not valid')
}

export type ReIssueTokensaram = {
    accessToken: string,
    refreshToken: string
}
export const reIssueTokens = (param: ReIssueTokensaram): any => {
    const apiName = "rest/common/auth/reissue"
    console.log('reIssueTokens param::', param)
    if (param.accessToken && param.refreshToken) {
        const params = { accessToken: param.accessToken, refreshToken: param.refreshToken }
        return axios({
            method: 'post',
            url: apiHost + apiName,
            headers: header,
            data: JSON.stringify(params)
        })
            .then(response => {
                console.log('reIssueTokens response::', response)
                return response.data
            })
            .catch((e) => {
                console.log('reIssueTokens error::', e)
                throw e;
                // return e;
            })
    }
    throw Error('reIssueTokens param is not valid')
}

export const refreshTokens = (): any => {
    const apiName = "rest/common/auth/refresh"
    console.log('refreshTokens param::')
    const token = getCookieToken() as string;
    const infoFromToken = getInfoFromToken(token);
    if (token && infoFromToken && isExpired(infoFromToken.exp) === false) {
        const params = { accessToken: "param for refreshTokens", refreshToken: token }
        return axios({
            method: 'post',
            url: apiHost + apiName,
            headers: header,
            data: JSON.stringify(params)
        })
            .then(response => {
                console.log('refreshTokens response::', response)
                return response.data
            })
            .catch((e) => {
                console.log('refreshTokens error::', e)
                throw e;
                // return e;
            })
    }
    else {
        console.log('refreshTokens token not saved in cookie or the token saved in cookie expired')
        return
    }
}

// for jwt exp
function isExpired(exp: number) {
    const equalizer = 1000;
    const now = new Date().getTime() / equalizer;
    console.log("the time compare exp:now -> ", exp, now)
    return exp < now ? true : false
}
function sleep(ms: number) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}
export const authorizedApi = async (apiName: string, params?: Object) => {

    const exp = store.getState().app.userInfoFromToken?.exp;
    const accessToken = store.getState().app.accessToken;
    const refreshToken = store.getState().app.refreshToken;
    if (exp && isExpired(exp) === true) {
        store.dispatch(reIssueAsyncAction.request({ accessToken, refreshToken }))
        sleep(3000);
    }

    const authorizedApiHeader = {
        'Content-Type': 'application/json',
        'Authorization': store.getState().app.grantType + " " + store.getState().app.accessToken,
        // credentials: 'include',
        'Access-Control-Expose-Headers': '*',
        // 'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
    }

    try {
        const response = await axios({
            method: 'post',
            url: apiHost + apiName,
            headers: authorizedApiHeader,
            data: JSON.stringify(params)
        });
        console.log('authorizedApi response::', response);
        return response.data;
    } catch (e) {
        console.log('authorizedApi error::', e);
        throw e;
    }

}