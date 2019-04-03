import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx'
import TalentCardDetail from '../TalentFeed/TalentCardDetail.jsx';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import TalentCard from './TalentCard.jsx';
// Renders the 'Talent Data' by connecting to the database and passing it to 'TalentCard' component...
export default class TalentDetail extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            newTalentData: {}
        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getValueByKeyFromTalentData = this.getValueByKeyFromTalentData.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData(){
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalentProfile/?id=' + '5c7a16883d0772387c62e20a',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let talentData = null;
                if (res.data) {
                    talentData = res.data
                    console.log("talentData From Database: " + JSON.stringify(talentData))
                }
                else {
                    TalentUtil.notification.show(JSON.stringify(res), "error", null, null)
                }
                this.updateWithoutSave(talentData)
            }.bind(this),
            error: function (res) {
                console.log(res.message)
            }
        })
    }  

    //updates component's state without saving data
    updateWithoutSave(newData) {
        let newTD = Object.assign({}, this.state.newTalentData, newData)
        this.setState({
            newTalentData: newTD
        })
    }

    //return the value of 'keyToSearch' field for the current record
    getValueByKeyFromTalentData(currentRecord, key1ToSearch, key2ToSearch) {

        let retValue = "";
        let experienceData, experienceRecord;
        let linkedInData;

        // ITERATE THROUGH AN OBJECT AND RETURN THE VALUES OF THE FIELDS
        Object.keys(currentRecord).forEach(function (key) {
            //console.log('Object.key : ' + key + ', Value : ' + currentRecord[key])
  //              companyContactElement = currentRecord['companyContact'];
                if (key1ToSearch == 'experience') {
                    // As "currentRecord['location']" is an object, pass it to a variable first and let that variable become an object
                    experienceData = currentRecord['experience'];

                    //      console.log("locationElement: " + JSON.stringify(locationElement));
                    if (experienceData) {
                        experienceRecord = experienceData[experienceData.length - 1];
                        retValue = experienceRecord[key2ToSearch];
                    }
                    else {
                        retValue = '';
                    }
                    // console.log(retValue);
                }
                else if (key1ToSearch == 'linkedAccounts') {
                    linkedInData = currentRecord['linkedAccounts'];
                    retValue = linkedInData[key2ToSearch];
                }
                else {
                    retValue = currentRecord[key1ToSearch];
                }
        })
        return retValue;
    }
    

    render() {
        let talentRecord = this.state.newTalentData;

        return (
            <div>
            {
                (talentRecord)
                ?
                <TalentCard
                    talentName={this.getValueByKeyFromTalentData(talentRecord, 'firstName') + ' ' + this.getValueByKeyFromTalentData(talentRecord, 'lastName')}
                    talentProfilePhotoUrl={this.getValueByKeyFromTalentData(talentRecord, 'profilePhotoUrl')}
                    talentCurrentEmployment={this.getValueByKeyFromTalentData(talentRecord, 'experience', 'company')}
                    talentDesignation={this.getValueByKeyFromTalentData(talentRecord, 'experience', 'position')}
                    talentVisaStatus={this.getValueByKeyFromTalentData(talentRecord, 'visaStatus')}
                    talentLinkedInUrl={this.getValueByKeyFromTalentData(talentRecord, 'linkedAccounts', 'linkedIn')}
                    talentGithubUrl={this.getValueByKeyFromTalentData(talentRecord, 'linkedAccounts', 'github')}
                    talentCVUrl={this.getValueByKeyFromTalentData(talentRecord, 'cvUrl')}
                    talentVideoUrl={this.getValueByKeyFromTalentData(talentRecord, 'videoUrl')}
                    talentSkills={this.getValueByKeyFromTalentData(talentRecord, 'skills')}
                />
                :
                
                    <b>There are no talents found for your recruitment company.</b>
                
            }
            </div>
        )
    }
}