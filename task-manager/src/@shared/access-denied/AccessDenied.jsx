import React from 'react';
import './AccessDenied.scss';

export default class AccessDenied extends React.Component {
    render() {
        return (
            <div className="access-denied">
                <img src='/assets/images/403-access-denied.png' alt='access-denied-img' />
            </div>
        );
    }
}
