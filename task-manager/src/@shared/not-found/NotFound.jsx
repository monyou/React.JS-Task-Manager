import React from 'react';
import './NotFound.scss';

export default class NotFound extends React.Component {
    render() {
        return (
            <div className="not-found">
                <img src='./assets/images/404-not-found.png' alt='not-found-img' useMap='#goHomeMap' />
                <map name="goHomeMap">
                    <area shape="rect" coords="167,72,307,110" alt="go-home" href="/" />
                </map>
            </div>
        );
    }
}
