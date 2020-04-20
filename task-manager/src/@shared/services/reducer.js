const initialState = {
    isLogged: false,
    loggedUser: null,
    loggedUserRole: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return Object.assign({}, state, {
                isLogged: true,
                loggedUserRole: action.userRole,
                loggedUser: action.userEmail
            });
        case 'LOGOUT_USER':
            return Object.assign({}, state, {
                isLogged: false,
                loggedUserRole: null,
                loggedUser: null
            });
        default:
            return state;
    }
}