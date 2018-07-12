const config = require('../config');
const { Auth0Lock } = require('auth0-lock');

function createLock () {
    //const { onLogging, onHide } = handlers;
    const lock = new Auth0Lock(config.CLIENT_ID, config.AUTH0_DOMAIN);

    /*lock.on("authenticated", function(authResult) {
        console.log(authResult);
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) { 
                return
            }
            localStorage.setItem("idToken", authResult.idToken);
            localStorage.setItem("accessToken", authResult.accessToken);
            localStorage.setItem("profile", JSON.stringify(profile));
            onLogging && onLogging();
        });
    });

    lock.on('hide', onHide);*/

    return lock;
}

module.exports = createLock;