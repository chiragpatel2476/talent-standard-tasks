import React from 'react';
import { Loader } from 'semantic-ui-react';
import Cookies from 'js-cookie';


export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employerData: {},
        };

        this.loadData = this.loadData.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.getValueByKeyFromCompanyContact = this.getValueByKeyFromCompanyContact.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let employerData = null;
                if (res.employer) {
                    employerData = res.employer
                  //  console.log("Data From Database: " + JSON.stringify(employerData))
                }
                this.updateWithoutSave(employerData)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
//        this.init()
    }



    //updates component's state (cached data) without saving data to the database
    updateWithoutSave(newData) {
        let newSD = Object.assign({}, this.state.employerData, newData)
        this.setState({
            employerData: newSD
        })
    }


    //return the value of 'keyToSearch' field for the current record
    getValueByKeyFromCompanyContact(currentRecord, keyToSearch) {

        let retValue = "";
        let locationElement, companyContactElement;

        // ITERATE THROUGH AN OBJECT AND RETURN THE VALUES OF THE FIELDS
        Object.keys(currentRecord).forEach(function (key) {
            //console.log('Object.key : ' + key + ', Value : ' + currentRecord[key])
            if (key == 'companyContact') {
                companyContactElement = currentRecord['companyContact'];
                if (keyToSearch == 'location') {
                    // As "currentRecord['location']" is an object, pass it to a variable first and let that variable become an object
                    locationElement = companyContactElement['location'];
              //      console.log("locationElement: " + JSON.stringify(locationElement));
                    retValue = locationElement["city"] + ", " + locationElement["country"];
                    // console.log(retValue);
                }
                else {
                    retValue = companyContactElement[keyToSearch];
                }
            }
        })
        return retValue;
    }


    render() {

        let companyProfilePictureSrc = (this.state.employerData.profilePhotoUrl ? this.state.employerData.profilePhotoUrl : "http://localhost:60290/images/image.png")

        let companyProfileData = this.state.employerData ? this.state.employerData : '';
        let companyName = companyProfileData ? this.getValueByKeyFromCompanyContact(companyProfileData, 'name') : '';
        let location = companyProfileData ? this.getValueByKeyFromCompanyContact(companyProfileData, 'location') : '';
        let email = companyProfileData ? this.getValueByKeyFromCompanyContact(companyProfileData, 'email') : '';
        let phone = companyProfileData ? this.getValueByKeyFromCompanyContact(companyProfileData, 'phone') : '';

        return (
            <div className="ui container">
                <div className="ui raised card">
                    <div className="content">
                        <div className="center aligned">
                            <img style={{ height: 60, width: 60, borderRadius: 30, alignContent: 'right', verticalAlign: 'top' }} src={companyProfilePictureSrc} />
                        </div>
                        <br/>
                        <div className="center aligned">
                            <h3 style={{lineHeight: 1}}>{companyName}</h3>
                            <i className="map alternate marker icon"></i>  {location}
                        </div>
                        <br/>
                        <div className="content">
                            <div className="center aligned">
                               We currently do not have specific skills that we desire.
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="description">
                            <p><i className="horizontally flipped phone icon"></i> : {phone}</p>
                            <p><i className="envelope icon"></i> : {email}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}