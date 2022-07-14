import cookies from 'js-cookie'

export const getUserFromCookie = () => {
    const cookie = cookies.get('auth')
    if (!cookie) {
        return
    }
    return JSON.parse(cookie)
}

export const setUserCookie = (user) => {
    cookies.set('auth', user, {
        // firebase id tokens expire in one hour
        // set cookie expiry to match
        expires: 1 / 24,
    })
}

export const setAccessTokenCookie = (accessToken) => {

    cookies.set('accessToken',accessToken, {

        expires: 1 / 24,

    })
}

export const getAccessTokenCookie = () => {

    const cookie = cookies.get('accessToken')

    if (!cookie) {
        return
    }
    return cookie;
}

export const removeUserCookie = () => cookies.remove('auth')