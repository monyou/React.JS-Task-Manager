export default (state = JSON.parse(localStorage.getItem('state')), action) => {
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
        case 'TOGGLE_LOADING':
            return Object.assign({}, state, {
                globalLoading: !state.globalLoading
            });
        default:
            return state;
    }
}