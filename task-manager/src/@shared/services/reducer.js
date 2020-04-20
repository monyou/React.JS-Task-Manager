const initialState = {
    isLogged: false,
    loggedUserRole: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return Object.assign({}, state, {
                isLogged: true,
                loggedUserRole: action.userRole
            });
        case 'LOGOUT_USER':
            return Object.assign({}, state, {
                isLogged: false,
                loggedUserRole: null
            });
        default:
            return state;
    }
}