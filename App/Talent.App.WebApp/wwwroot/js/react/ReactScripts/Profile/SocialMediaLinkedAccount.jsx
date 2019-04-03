/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);

        // From Parent Component
        const linkedAccounts = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: "",
            }

        this.state = {
            showSocialMediaEditSection: false,
            newSocialMediaDetails: linkedAccounts,
            isValidationError: false,
            formErrors: { linkedIn: '', github: '' },
            linkedInValid: false,
            githubValid: false,
            formValid: true
        }

        this.openSocialMediaEdit = this.openSocialMediaEdit.bind(this);
        this.closeSocialMediaEdit = this.closeSocialMediaEdit.bind(this);
        this.handleSocialMediaChange = this.handleSocialMediaChange.bind(this);
        this.saveSocialMediaDetails = this.saveSocialMediaDetails.bind(this);
        this.renderSocialMediaDisplay = this.renderSocialMediaDisplay.bind(this);
        this.renderSocialMediaEdit = this.renderSocialMediaEdit.bind(this);
        this.errorClass = this.errorClass.bind(this);
    }

    // Opens the Social Media Edit Section
    openSocialMediaEdit() {
        const linkedAccounts = Object.assign({}, this.props.linkedAccounts)
        this.setState({
            showSocialMediaEditSection: true,
            newSocialMediaDetails: linkedAccounts
        })
    }

    // Closes the social media edit mode
    closeSocialMediaEdit() {
        this.setState({
            showSocialMediaEditSection: false
        })
    }

    // Assigns the values to the state object as well as validates
    handleSocialMediaChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const data = Object.assign({}, this.state.newSocialMediaDetails)
        data[name] = value
        this.setState({
            newSocialMediaDetails: data
        }, () => { this.validateField(name, value) });
    }

    // Saves the Social Media Details to the database
    saveSocialMediaDetails() {
        console.log("saveSocialMediaComponent - this.props.componentId: " + this.props.componentId)
        console.log("saveSocialMediaDetails: " + JSON.stringify(this.state.newSocialMediaDetails))

        if (this.state.formValid) {
            const data = {};
            data.linkedAccounts = Object.assign({}, this.state.newSocialMediaDetails);
            this.props.controlFunc(this.props.componentId, data);
            this.closeSocialMediaEdit();
        }
    }

    // Validate the field values
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let linkedInValid = this.state.linkedInValid;
        let githubValid = this.state.githubValid;
        var formValid = this.state.formValid;

        if (value != "") {
            switch (fieldName) {
                case 'linkedIn':
                    linkedInValid = value.match(/^(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
                    fieldValidationErrors.linkedIn = linkedInValid ? '' : ' is invalid';
                    break;
                // Github project repository validation regex: (?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$
                case 'github':
                    githubValid = value.match(/^(https?|ftp):\/\/?(?:www\.)?github.com[.a-z0-9-/-]+/);
                    fieldValidationErrors.github = githubValid ? '' : ' is invalid';
                    break;
                default:
                    break;
            }
            //console.log("linkedInValid: " + linkedInValid + ", githubValid: " + githubValid);

            if (linkedInValid != null && githubValid != null) {
                formValid = true
            }
            else {
                formValid = false
            }

            this.setState({
                formErrors: fieldValidationErrors,
                linkedInValid: linkedInValid,
                githubValid: githubValid,
            });
        }
        else {
            formValid = true
        }

        this.setState({
            formValid: formValid
        });

    };

    // Displays 'Error' 
    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }


    render() {

        // let { linkedAccounts, updateProfileData, saveProfileData } = this.props;

        return (
            this.state.showSocialMediaEditSection ? this.renderSocialMediaEdit() : this.renderSocialMediaDisplay()
        );
    }

    // Edit Section
    renderSocialMediaEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.newSocialMediaDetails.linkedIn}
                    controlFunc={this.handleSocialMediaChange}
                    maxLength={150}
                    placeholder="Enter your LinkedIn URL"
                    errorMessage="Please enter a valid LinkedIn URL"
                    isError={this.errorClass(this.state.formErrors.linkedIn)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.newSocialMediaDetails.github}
                    controlFunc={this.handleSocialMediaChange}
                    maxLength={150}
                    placeholder="Enter your GitHub URL"
                    errorMessage="Please enter a valid GitHub URL"
                    isError={this.errorClass(this.state.formErrors.github)}
                />

                <button type="button" className="ui teal button" onClick={this.saveSocialMediaDetails}>Save</button>
                <button type="button" className="ui button" onClick={this.closeSocialMediaEdit}>Cancel</button>
            </div>
        )
    }

    // Display Section
    renderSocialMediaDisplay() {
        return (
            <div className="row">
                <div className="fourteen wide column inline-controls"> 
                    <a className="ui linkedin blue label social-media-buttons" href={this.props.linkedAccounts.linkedIn} target="_blank">
                        <i className="linkedin icon"></i>
                        LinkedIn
                    </a>
                    <a href={this.props.linkedAccounts.github} className="ui black label social-media-buttons" target="_blank">
                        <i className="github icon"></i>
                        GitHub
                    </a>
                </div>
                <div className="two wide column">
                    <button type="button" className="ui right floated teal button" onClick={this.openSocialMediaEdit}>Edit</button>
                </div>
            </div>
        )
    }
}