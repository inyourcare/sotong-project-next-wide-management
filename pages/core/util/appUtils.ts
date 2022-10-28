import { Buffer } from 'buffer';

export type InfoFromToken = {
    auth: AUTH_ROLE,
    exp: number,
    iat: number,
    sub: string
} | null

export const enum AUTH_ROLE {
    ADMIN = 'ROLE_ADMIN',
    USER = 'ROLE_USER',
}

export function getInfoFromToken (token:String) {
    const base64Payload = token.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    const payload = Buffer.from(base64Payload, 'base64');
    const userInfo: InfoFromToken = JSON.parse(payload.toString());
    console.log('jwt infos::', userInfo);
    return userInfo;
}