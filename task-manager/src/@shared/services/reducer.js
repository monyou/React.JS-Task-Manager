const initialState = {
    isLogged: false,
    loggedUserRole: null,
    sidebarOpened: false
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
        case 'TOGGLE_SIDEBAR':
            return Object.assign({}, state, {
                sidebarOpened: !state.sidebarOpened
            });
        default:
            return state;
    }
}