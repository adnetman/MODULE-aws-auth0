const { API_URL } = require('../config');
const createLock = require('../lib/auth0');

const SIGNIN_UP = 'signin/signup';
const SIGNOUT = 'signout';

class AwsAuth {
    constructor (mountingNode) {
        this.root = mountingNode;
        this.state = {
            loggedIn : false,
            loading : false
        }

        this._lock = createLock();
        this.mountComponent();
        this.bindEvents();

    }

    mountComponent () {
        this.authButton = document.createElement('button');
        this.authButton.innerHTML = SIGNIN_UP;
        this.authButton.className = 'button is-large is-fullwidth';

        this.requestButton = document.createElement('button');
        this.requestButton.innerHTML = 'Request AWS Data';
        this.requestButton.className = 'button is-large is-hidden is-fullwidth';
        const div = document.createElement('div');
        div.appendChild(this.authButton);
        div.appendChild(this.requestButton);

        this.root.className = 'section';
        this.root.appendChild(div);
    }

    bindEvents () {
       this.authButton.addEventListener('click', this.authenticate.bind(this));
       this.requestButton.addEventListener('click', this.requestData.bind(this));
       this._lock.on('authenticated', this.onLoggedIn.bind(this))
    }

    requestData () {
        const { loggedIn } = this.state;
        if (!loggedIn) { return; }
        this.state.loading = true;
        this.update();
        fetch(`${API_URL}/pets`, {
            headers : {
                'Authorization' : `Bearer ${localStorage.getItem('idToken')}`,
                'Content-type' : 'application/json'
            }
        })
        .then(blob => blob.json())
        .then(resonse => {
            this.state.loading = false;
            this.update();
            console.log(resonse);
        })
        .catch(err => {
            this.state.loading = false;
            this.update();
            console.log(err);
        })
        
    }

    authenticate () {
        const { loggedIn } = this.state;
        if (loggedIn) {
            console.log('logout');
            this.logOut();
        } else {
            console.log('login');
            this._lock.show();
        }
    }

    clearStorage () {
        localStorage.removeItem('idToken');
    }

    logOut () {
        this.state.loggedIn = false;
        this.clearStorage();
        this._lock.logout({
            returnTo : 'http://localhost:8080/'
        });
    }

    onLoggedIn (authResult) {
        console.log(authResult);
        this.state.loggedIn = true;
        localStorage.setItem("idToken", authResult.idToken);
        this.requestButton.classList.remove('is-hidden');
        this.update()
    }

    update () {
        const { loggedIn, loading } = this.state;
        this.authButton.innerHTML = (
            loggedIn
            ? SIGNOUT 
            : SIGNIN_UP
        )

        if (loading) {
            this.requestButton.classList.add('is-loading');
        } else {
            this.requestButton.classList.remove('is-loading');
        }
    }

}

module.exports = AwsAuth;