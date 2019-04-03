/* Self introduction section */
import React, { Component } from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie'

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

       
        this.state = {
            showSelfIntroducionEditSection: false,
            descriptionChars: this.props.description ? this.props.description.length : 0,
            summaryChars: this.props.summary ? this.props.summary.length : 0,
            summaryCharsLimit: 150,
            descCharsLimit: 600,
            siSummary: this.props.summary,
            siDescription: this.props.description,
            isValidationError: false,
            formErrors: { summaryErrors: '', descriptionErrors: '' },
            summaryValid: false,
            descriptionValid: false,
            formValid: false
        };
        this.openSelfIntroducionEdit = this.openSelfIntroducionEdit.bind(this);
        this.closeSelfIntroducionEdit = this.closeSelfIntroducionEdit.bind(this);
        this.handleSelfIntroductionChange = this.handleSelfIntroductionChange.bind(this);
        this.saveSelfIntroducionDetails = this.saveSelfIntroducionDetails.bind(this);
        this.validateField = this.validateField.bind(this);
        this.errorClass = this.errorClass.bind(this);
    };

    componentDidMount() {
        this.setState({
            
        })
    }

    // Opens the Social Media Edit Section
    openSelfIntroducionEdit() {

        // Displays the data from state variables inside the text boxes
        this.setState({
            siSummary: this.props.summary,
            siDescription: this.props.description,
            descriptionChars: this.props.description ? this.props.description.length : 0,
            summaryChars: this.props.summary ? this.props.summary.length : 0,
            showSelfIntroducionEditSection: true
        })
    }

    // Closes the social media edit mode
    closeSelfIntroducionEdit() {
        this.setState({
            showSelfIntroducionEditSection: false
        })
    }

    // Assigns the values to the state object as well as validates
    handleSelfIntroductionChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        //        const data = Object.assign({}, this.state.newSocialMediaDetails)

            this.setState({
                [name] : value,
                descriptionChars: this.state.siDescription ? this.state.siDescription.length : 0,
                summaryChars: this.state.siSummary ? this.state.siSummary.length : 0
            }, () => this.validateField(name, value))

    }


    // Saves the Social Media Details to the database
    saveSelfIntroducionDetails() {
        //        console.log("saveSocialMediaComponent - this.props.componentId: " + this.props.componentId)
        //        console.log("saveSocialMediaDetails: " + JSON.stringify(this.state.newSocialMediaDetails))
        const data = {};
        data.summary = this.state.siSummary;
        data.description = this.state.siDescription;
//        this.validateField(data);
        //console.log("saveSelfIntroducionDetails - this.state.formValid: " + this.state.formValid);
        if (this.state.formValid) {
            this.props.controlFunc(this.props.componentId, data);
            this.closeSelfIntroducionEdit();
        }
    }


    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let summaryValid = this.state.summaryValid;
        let descriptionValid = this.state.descriptionValid;
        var formValid = this.state.formValid;

        if (fieldName == "siSummary" && value == "") {
            fieldValidationErrors.summaryErrors = 'Summary is invalid';
            summaryValid = false;
        }
        else {
            fieldValidationErrors.summaryErrors = '';
            summaryValid = true;
        }

        if (fieldName == "siDescription" && value == "") {
            fieldValidationErrors.descriptionErrors = 'Please provide description about your self';
            descriptionValid = false;
        }
        else if (fieldName == "siDescription" && value.length < 150) {
            fieldValidationErrors.descriptionErrors = 'Description must be atleast 150 characters';
            descriptionValid = false;
        }
        else {
            fieldValidationErrors.descriptionErrors = '';
            descriptionValid = true;
        }

        if (summaryValid == true && descriptionValid == true) {
            formValid = true
        }
        else {
            formValid = false
        }

        //console.log("validateField function: formValid = " + formValid);

        this.setState({
            formErrors: fieldValidationErrors,
            summaryValid: summaryValid,
            descriptionValid: descriptionValid,
            formValid: formValid
        }, () => console.log("State Changed After Validatation"));

    }

    // Displays 'Error' 
    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    


    render() {
        return (
            this.state.showSelfIntroducionEditSection ? this.renderSelfIntroductionEdit() : this.renderSelfIntroductionDisplay()
        );
    }

    renderSelfIntroductionDisplay() {

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>{this.props.summary}</p>
                        <p>{this.props.description}</p>
                        <div>
                            <button className="ui right floated teal button" onClick={this.openSelfIntroducionEdit}>Edit</button>
                        </div>
                    </React.Fragment>
                    
                </div>
            </div>
        )
    }

    renderSelfIntroductionEdit() {
        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <div className="field" >
                        <ChildSingleInput
                            inputType="text"
                            maxLength={this.state.summaryCharsLimit}
                            name="siSummary"
                            placeholder="Please provide a short summary about yourself"
                            value={this.state.siSummary}
                            controlFunc={this.handleSelfIntroductionChange}
                            errorMessage="Please provide a brief summary"
                            isError={this.errorClass(this.state.formErrors.summaryErrors)}
                        >
                        </ChildSingleInput>
                    </div>
                    <p><b>Summary must be no more than 150 chars. </b>Characters remaining : {this.state.summaryCharsLimit - this.state.summaryChars} / {this.state.summaryCharsLimit}</p>

                    <div className="field">
                        <textarea
                            maxLength={this.state.descCharsLimit}
                            name="siDescription"
                            placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
                            value={this.state.siDescription}
                            onChange={this.handleSelfIntroductionChange}
                        >
                        </textarea>
                        {this.state.formErrors.descriptionErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.descriptionErrors}</div> : null}
                    </div>
                    <p><b>Description must be between 150-600 chars. </b> Characters remaining : {this.state.descCharsLimit - this.state.descriptionChars} / {this.state.descCharsLimit}</p>
                    <button type="button" className="ui teal button" onClick={this.saveSelfIntroducionDetails}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeSelfIntroducionEdit}>Cancel</button>
                </React.Fragment>
            </div>
        )
    }

}