import React from 'react';
import './YesNo.scss';

export default class YesNo extends React.Component {
    render() {
        return (
            <>
                <div className="yes-no-dialog">
                    <h3 className="title">{this.props.title}</h3>
                    <div className="actions">
                        <button className='btn-yes' onClick={this.props.handleYes}>Yes</button>
                        <button className='btn-no' onClick={this.props.handleNo}>No</button>
                    </div>
                </div>
                <div className="overlay"></div>
            </>
        );
    }
}