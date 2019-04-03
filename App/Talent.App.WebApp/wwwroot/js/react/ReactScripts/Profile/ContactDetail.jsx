import React, { Component } from "react";
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Location } from '../Employer/CreateJob/Location.jsx';
export class IndividualDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details,
            formErrors: { firstNameError: '', lastNameError: '', emailError: '', phoneError:'' },
            formValid: false,
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            phoneValid: false 
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.errorClass = this.errorClass.bind(this);
    }

    openEdit() {
        // Get the values from the 'props'
        const details = Object.assign({}, this.props.details)
        // Replace null values with 'empty strings'
        details.firstName = details.firstName == null ? details.firstName = '' : details.firstName;
        details.lastName = details.lastName == null ? details.lastName = '' : details.lastName;
        details.email = details.email == null ? details.email = '' : details.email;
        details.phone = details.phone == null ? details.phone = '' : details.phone;
        // Assign the values to state variables
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {

        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
       // console.log("event.target.value: " + event.target.value);
        const name = event.target.name;
        const value = event.target.value == null ? '' : event.target.value;
        data[name] = value;
        this.setState({
            newContact: data
        }, () => { this.validateField(name, value) })
    }

    // Validate the field values
    validateField(fieldName, value, funcName) {
        let isFirstNameValid = this.state.firstNameValid;
        let isLastNameValid = this.state.lastNameValid;
        let isEmailValid = this.state.emailValid;
        let isPhoneValid = this.state.phoneValid; 
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;

            switch (fieldName) {
                case 'firstName':
                    isFirstNameValid = (value == '' || value == null) ? false : true;
                    fieldValidationErrors.firstNameError = isFirstNameValid ? '' : ' is invalid';
                    isValueValidated = isFirstNameValid;
                    this.setState({ firstNameValid: isFirstNameValid }, () => console.log("firstname validated -- firstNameValid" + this.state.firstNameValid));
                    break;
                case 'lastName':
                    isLastNameValid = (value == '' || value == null) ? false : true;
                    fieldValidationErrors.lastNameError = isLastNameValid ? '' : ' is invalid';
                    isValueValidated = isLastNameValid;
                    this.setState({ lastNameValid: isLastNameValid }, () => console.log("lastname validated -- lastNameValid" + this.state.lastNameValid));
                    break;
                case 'email':
                    isEmailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                    fieldValidationErrors.emailError = isEmailValid ? '' : ' is invalid';
                    isValueValidated = isEmailValid ? true : false; 
                    this.setState({ emailValid: isEmailValid }, () => console.log("email validated -- emailValid" + this.state.emailValid));
                    break;
                case 'phone':
                    if (value == null || value == '') {
                        isPhoneValid = "True"; // eliminates the 'null'
                    } else {
                        isPhoneValid = value.match(/^\+?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i);
                        fieldValidationErrors.phoneError = isPhoneValid ? '' : ' is invalid';
                    }
                    isValueValidated = isPhoneValid ? true : false; 
                    this.setState({ phoneValid: isPhoneValid }, () => console.log("Phone validated -- phoneValid" + this.state.phoneValid ));
                default:
                    break;
            }

        if ((isFirstNameValid) && (isLastNameValid) && (isEmailValid) && (isPhoneValid))  {
                formValid = true
        }
        else {
                formValid = false
        }
       // console.log("formValid: " + formValid);

            this.setState({
                formErrors: fieldValidationErrors,
                formValid: formValid
        });
        if (funcName == "saveContact") {
            return isValueValidated;
        }
    };

    // Displays 'Error' 
    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    saveContact() {
        let totalFieldsToValidate = 4;
        let trueValidationCounts = 0;
        let falseValidationCounts = 0;
        let funcReturnValue;
        const data = Object.assign({}, this.state.newContact)
        Object.keys(data).forEach((key) => {
            funcReturnValue = false;
            funcReturnValue = this.validateField(key, data[key], "saveContact");
            if (funcReturnValue) {
                trueValidationCounts += 1;
            }
            else {
                falseValidationCounts += 1;
            }
        });

        if (trueValidationCounts == totalFieldsToValidate) {
        // Call the 'parent' component function and pass the data using 'props.controlFunc'
            this.props.controlFunc(this.props.componentId, data)
            this.closeEdit()
        }
        else {
            TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
        }
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="First Name"
                    name="firstName"
                    value={this.state.newContact.firstName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your first name"
                    errorMessage="Please enter a valid first name"
                    isError={this.errorClass(this.state.formErrors.firstNameError)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Last Name"
                    name="lastName"
                    value={this.state.newContact.lastName}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid last name"
                    isError={this.errorClass(this.state.formErrors.lastNameError)}
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                    isError={this.errorClass(this.state.formErrors.emailError)}
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number in (000 000 0000) format"
                    isError={this.errorClass(this.state.formErrors.phoneError)}
                />

                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let fullName = this.props.details ? `${this.props.details.firstName} ${this.props.details.lastName}` : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {fullName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}


export class CompanyDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                name: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        // Retrieve the data from 'props' and assign it to 'state' variable
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.setState({
            newContact: data
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newContact)
        // Pass the data of this component to a parent component method 
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let location = { city: '', country: '' }
        if (this.state.newContact && this.state.newContact.location) {
            location = this.state.newContact.location
        }

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Name"
                    name="name"
                    value={this.state.newContact.name}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid name"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                />
                Location:
                <Location location={location} handleChange={this.handleChange} />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {
        // Retrieve data from 'props' and replace 'null' values to an empty string...
        let companyName = this.props.details ? this.props.details.name : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""
        let location = {city:'',country:''}
        if (this.props.details && this.props.details.location) {
            location = this.props.details.location
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {companyName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p> Location: {location.city}, {location.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}
