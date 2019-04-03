import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Popup, Icon } from 'semantic-ui-react'
import TalentCardDetail from '../TalentFeed/TalentCardDetail.jsx';
// Displays 'Talent Details' in the form of a card: (contains child component 'Talent Card Detail')
export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayProfile: true
        }

        this.changeProfileOrVideoMode = this.changeProfileOrVideoMode.bind(this);
        this.renderLabel = this.renderLabel.bind(this);
    };

    changeProfileOrVideoMode() {
        let currentDisplayProfile = this.state.displayProfile;
        this.setState({
            displayProfile: (!currentDisplayProfile)
        })
    }

    renderLabel(obj, index) {
        return (
            <label key={index} className="ui blue basic label">{"#" + obj.name}</label>
        );
    }
    
    render() {
        return (
            <div className="ui container">
                <div className="ui fluid card talent-card-ui-fluid-card">
                    <div className="content">
                        <i className="ui large right floated star icon"></i>
                        <div className="header">{this.props.talentName}</div>
                    </div>
                    <div className="content">
                        {
                            <TalentCardDetail
                                displayProfile={this.state.displayProfile}
                                talentProfilePhotoUrl={this.props.talentProfilePhotoUrl ? this.props.talentProfilePhotoUrl : 'http://localhost:60290/images/image.png'}
                                talentVideoUrl={this.props.talentVideoUrl ? this.props.talentVideoUrl : 'https://www.youtube.com/watch?v=9PXlh8cACug'}
                                talentCurrentEmployment={this.props.talentCurrentEmployment ? this.props.talentCurrentEmployment : "-"}
                                talentVisaStatus={this.props.talentVisaStatus ? this.props.talentVisaStatus : "-"}
                                talentDesignation={this.props.talentDesignation ? this.props.talentDesignation : "-"}
                            />
                        }
                        
                    </div>
                    <div className="content">
                        <div className="ui four column grid">
                            <div className="column">
                                {
                                    (this.state.displayProfile)
                                    ?
                                    (<i className="video icon click-toggle-mode" onClick={this.changeProfileOrVideoMode}></i>)
                                    :
                                    (<i className="user icon click-toggle-mode" onClick={this.changeProfileOrVideoMode}></i>)
                                }
                            </div>
                            <div className="column">
                                <a href={this.props.talentCVUrl ? this.props.talentCVUrl : ''} target="_blank">
                                    <i className="file pdf outline icon"></i>
                                </a>
                            </div>
                            <div className="column">
                                <a href={this.props.talentLinkedInUrl ? this.props.talentLinkedInUrl : ''} target="_blank">
                                    <i className="linkedin icon"></i>
                                </a>
                            </div>
                            <div className="column">
                                <a href={this.props.talentGithubUrl ? this.props.talentGithubUrl : ''} target="_blank">
                                    <i className="github icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="extra content">
                        {
                                (this.props.talentSkills)
                                ?
                                <div className="ui large transparent left icon input">
                                    {
                                        this.props.talentSkills.map((skill, index) => {
                                            return this.renderLabel(skill, index);    
                                        })
                                    }
                                </div> : ""
                    }
                    </div>
                </div>
            </div>
        );
       
    }

   
}

TalentCard.propTypes = {
    talentName: PropTypes.string.isRequired,
    talentProfilePhotoUrl: PropTypes.string,
    talentCurrentEmployment: PropTypes.string,
    talentDesignation: PropTypes.string,
    talentVisaStatus: PropTypes.string,
    talentLinkedInUrl: PropTypes.string,
    talentGithubUrl:PropTypes.string,
    talentCVUrl:PropTypes.string,
    talentVideoUrl: PropTypes.string,
}
            
