const sessions = new Map();

function getSession(userId) {

    if (!sessions.has(userId)) {

        sessions.set(userId, {
            state: "MAIN_MENU",
            data: {}
        });

    }

    return sessions.get(userId);

}

function updateSession(
    userId,
    updates
) {

    const session =
        getSession(userId);

    const updatedSession = {

        ...session,

        ...updates

    };

    sessions.set(
        userId,
        updatedSession
    );

    return updatedSession;

}

function clearSession(userId) {

    sessions.delete(userId);

}

module.exports = {

    getSession,
    updateSession,
    clearSession

};