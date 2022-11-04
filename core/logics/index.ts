import { logger } from "@core/logger";
import { routes } from "@core/reference";
import { Session } from "next-auth";

export const checkAuthorized = (session: Session | null, resolvedUrl: string) => {
    logger.debug('checkAuthorized', session, resolvedUrl)
    const authorized = routes.map(route => { if (route.link === resolvedUrl) return route; else return null }).filter(r => r).at(0)?.authorized
    if (!authorized) {
        // anyone can join
        logger.debug('anyone can join', resolvedUrl)
        return true
    }
    if (!session) {
        logger.debug('session need', resolvedUrl)
        return false
    }
    const sessionRole = session.user.role;
    if (sessionRole) {
        const check = authorized.includes(sessionRole)
        logger.debug('checker', authorized, sessionRole, check)
        if (check) {
            logger.debug('authorized', sessionRole)
            return true
        }
    }
    return false

}