import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
// Displays 'Talent Details Only' part of the 'Talent Card'
export default class TalentCardDetail extends React.Component {
    constructor(props) {
        super(props);
    }
   
    render() {
        return (

            <div className="ui container" style={{ width: '100%', height: '100%' }}>
            {
                    (this.props.displayProfile)
                    ?
                        <div>
                            <div className="inline-controls" style={{ width: '40%', height: '100%' }}>
                                <div className="image">
                                    <img src={this.props.talentProfilePhotoUrl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            </div>
                            <div className="inline-controls">
                                <div className="talent-card-detail-padding">
                                    <p><b>Talent Snapshot</b></p>
                                    <p>
                                        CURRENT EMPLOYER<br/>
                                        {this.props.talentCurrentEmployment}
                                    </p>
                                    <p>
                                        VISA STATUS<br/>
                                        {this.props.talentVisaStatus}
                                    </p>
                                    <p>
                                        POSITION<br/>
                                        {this.props.talentDesignation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    :
                        <div>
                            <ReactPlayer
                                url={this.props.talentVideoUrl}
                                playing={false}
                                controls={true}
                                width={'100%'}
                            />
                        </div>
                }
            </div>
            
        )
    }
}

