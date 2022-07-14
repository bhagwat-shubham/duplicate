export const mapUserData = (user) => {
    const { uid, email, token, displayName, photoUrl } = user
    return {
        id: uid,
        email,
        name: displayName,
        token,
        profilePic: photoUrl
    }
}