import React from 'react'
import Cookies from 'js-cookie'
import countries from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';


export class Address extends React.Component {
    constructor(props) {
        super(props)

        const address = props.address ?
            Object.assign({}, props.address)
            : {
                number: '',
                street: '',
                suburb: '',
                postCode: '',
                city: '',
                country: ''
            }

        this.state = {
            showAddressEditSection: false,
            newAddressDetails: address,
            formErrors: { numberErrors: '', streetErrors: '', suburbErrors: '', postCodeErrors: '', cityErrors: '', countryErrors: ''},
            numberValid: false,
            streetValid: false,
            suburbValid: false,
            postcodeValid: false,
            cityValid: false,
            countryValid: false,
            formValid: false
        }

        this.openAddressEdit = this.openAddressEdit.bind(this);
        this.closeAddressEdit = this.closeAddressEdit.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.validateField = this.validateField.bind(this);
        this.errorClass = this.errorClass.bind(this);
        this.saveAddressDetails = this.saveAddressDetails.bind(this);
        this.renderAddressDisplay = this.renderAddressDisplay.bind(this);
        this.renderAddressEdit = this.renderAddressEdit.bind(this);

    }


    // Opens the Address Edit Section
    openAddressEdit() {
        // Retrieve the data from 'props' and replace 'null' values with 'blank' chars
        const addressDetails = Object.assign({}, this.props.addressData)
        addressDetails.number = addressDetails.number ? addressDetails.number : '';
        addressDetails.street = addressDetails.street ? addressDetails.street : '';
        addressDetails.suburb = addressDetails.suburb ? addressDetails.suburb : '';
        addressDetails.postCode = addressDetails.postCode ? addressDetails.postCode : '';
        addressDetails.city = addressDetails.city ? addressDetails.city : '';
        addressDetails.country = addressDetails.country ? addressDetails.country : '';

        this.setState({
            showAddressEditSection: true,
            newAddressDetails: addressDetails
        })
    }

    // Closes the Address Edit Section
    closeAddressEdit() {
        this.setState({
            showAddressEditSection: false
        })
    }



    handleAddressChange(event) {
        var data = Object.assign({}, this.state.newAddressDetails);

        const name = event.target.name;
        let value = event.target.value;
        const id = event.target.id;

        data[name] = value;
        if (name == "country") {
            data["city"] = "";
        }

        this.setState({
            newAddressDetails: data
        }, this.validateField(name, value));

    }

    // Validate the field values
    validateField(fieldName, value, funcName) {

        
        let isNumberValid = this.state.numberValid;
        let isStreetValid = this.state.streetValid;
        let isSuburbValid = this.state.suburbValid;
        let isPostcodeValid = this.state.postcodeValid;
        let isCityValid = this.state.cityValid;
        let isCountryValid = this.state.countryValid;
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;

        switch (fieldName) {
            case 'number': 
                isNumberValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.numberErrors = isNumberValid ? '' : ' is invalid';
                isValueValidated = isNumberValid;
                this.setState({ numberValid: isNumberValid }, () => console.log("Street Number Validated"));
                break;
            case 'street':
                isStreetValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.streetErrors = isStreetValid ? '' : ' is invalid';
                isValueValidated = isStreetValid;
                this.setState({ streetValid: isStreetValid }, () => console.log("Street Number Validated"));
                break;
            case 'suburb': 
                isSuburbValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.suburbErrors = isSuburbValid ? '' : ' is invalid';
                isValueValidated = isSuburbValid;
                this.setState({ suburbValid : isSuburbValid }, () => console.log("Suburb Name Validated"));
                break;
            case 'postCode': 
                isPostcodeValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.postCodeErrors = isPostcodeValid ? '' : ' is invalid';
                isValueValidated = isPostcodeValid;
                this.setState({ postcodeValid: isPostcodeValid }, () => console.log("Postcode Validated"));
                break;
            case 'city': 
                isCityValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.cityErrors = isCityValid ? '' : 'Please select a city';
                isValueValidated = isCityValid;
                this.setState({ cityValid: isCityValid }, () => console.log("City Validated"));
                break;
            case 'country':
                isCountryValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.countryErrors = isCountryValid ? '' : 'Please select a country';
                isValueValidated = isCountryValid;
                this.setState({ countryValid: isCountryValid }, () => console.log("Country Validated"));
                break;
            default:
                break;
        }

        //if ((isNumberValid) && (isStreetValid) && (isSuburbValid) && (isPostcodeValid) && (isCityValid) && (isCountryValid)) {
        //    formValid = true
        //}
        //else {
        //    formValid = false
        //}

        this.setState({
            formErrors: fieldValidationErrors,
            formValid: formValid
        });

        if (funcName == "saveAddressDetails") {
            return isValueValidated;
        }
    }

    // Displays 'Error' 
    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    saveAddressDetails() {
        let totalFieldsToValidate = 6;
        let trueValidationCounts = 0;
        let falseValidationCounts = 0;
        let funcReturnValue;
        let data = {};

        let dataToValidate = Object.assign({}, this.state.newAddressDetails);

        Object.keys(dataToValidate).forEach((key) => {
            funcReturnValue = false;
            funcReturnValue = this.validateField(key, dataToValidate[key], "saveAddressDetails");
            if (funcReturnValue) {
                trueValidationCounts += 1;
            }
            else {
                falseValidationCounts += 1;
            }
        });

        // console.log(this.props.componentId)
        // console.log(this.state.newContact)
        if (trueValidationCounts == totalFieldsToValidate) {
            data.address = dataToValidate;
       //     console.log("Final Data: " + JSON.stringify(data));
            this.props.controlFunc(this.props.componentId, data)
            this.closeAddressEdit()
        }
        else {
            TalentUtil.notification.show("Data validation Errors -- Profile did not update successfully", "error", null, null)
        }
    }


    render() {
        return (
            this.state.showAddressEditSection ? this.renderAddressEdit() : this.renderAddressDisplay()
        )
    }

    renderAddressDisplay() {
        let addressData = this.props.addressData;
        let addressLine = (addressData.number ? (addressData.number + ", ") : "") + (addressData.street ? (addressData.street + ", ") : "") + (addressData.suburb ? (addressData.suburb + ", ") : "") + (addressData.postCode); 

        return (
            <div className="row">
                <div className="sixteen wide column">
                    <React.Fragment>
                        <p>Address: {addressLine} </p>
                        <p>City: {addressData.city}</p>
                        <p>Country: {addressData.country}</p>
                        <div>
                            <button className="ui right floated teal button" onClick={this.openAddressEdit}>Edit</button>
                        </div>
                    </React.Fragment>
                </div>
            </div>
        )


    }

    renderAddressEdit() {
        let countriesOptions = [];
        let citiesOptions = [];
        const selectedCountry = this.state.newAddressDetails.country;
        const selectedCity = this.state.newAddressDetails.city;

        countriesOptions = Object.keys(countries).map((x) => <option key={x} value={x}>{x}</option>);

        if (selectedCountry != "" && selectedCountry != null) {

            var popCities = countries[selectedCountry].map((x,i) => <option key={i} value={x}> {x}</option>);
        }
            citiesOptions = <span><label><b>City</b></label><select
                className="ui dropdown"
                placeholder="City"
                value={selectedCity}
                onChange={this.handleAddressChange}
                name="city">
                <option value=""> Select a town or city</option>
                {popCities}
            </select>
                {this.state.formErrors.cityErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.cityErrors}</div> : null}
                </span>
        

        return (
            <React.Fragment>
                <table className="full-width-table custom-table">
                <tr>
                    <td className="ui three wide">
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            maxLength={15}
                            name="number"
                            placeholder="Street Number"
                            value={this.state.newAddressDetails.number}
                            controlFunc={this.handleAddressChange}
                            errorMessage="Please provide a street number"
                            isError={this.errorClass(this.state.formErrors.numberErrors)}
                        >
                        </ChildSingleInput>
                    </td>
                    <td className="ui nine wide">
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            maxLength={80}
                            name="street"
                            placeholder="Street Name"
                            value={this.state.newAddressDetails.street}
                            controlFunc={this.handleAddressChange}
                            errorMessage="Please provide a street name"
                            isError={this.errorClass(this.state.formErrors.streetErrors)}
                        >
                        </ChildSingleInput>
                    </td>
                    <td className="ui four wide">
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            maxLength={50}
                            name="suburb"
                            placeholder="Suburb Name"
                            value={this.state.newAddressDetails.suburb}
                            controlFunc={this.handleAddressChange}
                            errorMessage="Please provide a suburb name"
                            isError={this.errorClass(this.state.formErrors.suburbErrors)}
                        >
                        </ChildSingleInput>
                    </td>
                </tr>
                <tr>
                    <td className="ui six wide">
                        <label><b>Country</b></label>
                        <select className="ui right labeled dropdown"
                            placeholder="Country"
                            value={selectedCountry}
                            onChange={this.handleAddressChange}
                            name="country">
                            <option value="">Select a country</option>
                            {countriesOptions}
                        </select>
                        {this.state.formErrors.countryErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.countryErrors}</div> : null}
                    </td>
                    <td className="ui six wide">
                        {citiesOptions}
                    </td>
                    <td className="ui four wide">
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            maxLength={12}
                            name="postCode"
                            placeholder="Post Code"
                            value={this.state.newAddressDetails.postCode}
                            controlFunc={this.handleAddressChange}
                            errorMessage="Please provide a postcode"
                            isError={this.errorClass(this.state.formErrors.postCodeErrors)}
                        >
                        </ChildSingleInput>
                    </td>
                </tr>
                <tr>
                <td className="ui sixteen wide">
                    <button type="button" className="ui teal button" onClick={this.saveAddressDetails}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeAddressEdit}>Cancel</button>
                </td>
                </tr>
                </table>
            </React.Fragment>
        );
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isStateDataInitialised: false,
            newNationalityDetails: this.props.nationalityData
        }
        this.handleNationalityChange = this.handleNationalityChange.bind(this);   
        this.saveNationalityData = this.saveNationalityData.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // Any time the current user changes,
        // Reset any parts of state that are tied to that user.
       // console.log("Nationality: getDerivedStateFromProps");
        // props.nationalityData !== state.newNationalityDetails

        if (state.isStateDataInitialised && !state.isStateDataInitialised) {
            return {
                newNationalityDetails: props.nationalityData,
                isStateDataInitialised: true
            };
        }
        return null;
    }

    handleNationalityChange(event) {

        let name = event.target.name;
        let value = event.target.value;

        [name] = value;
        
        this.setState({
            newNationalityDetails: value
        }, this.saveNationalityData);

    }

    saveNationalityData() {
        let data = {};
        data.nationality = this.state.newNationalityDetails;
        this.props.controlFunc(this.props.componentId, data)
    }
    render() {

        let countriesOptions = [];
        const selectedCountry = (this.state.isStateDataInitialised) ? this.state.newNationalityDetails : this.props.nationalityData;

        countriesOptions = Object.keys(countries).map((x) => <option key={x} value={x}>{x}</option>);


        return (
            <React.Fragment>
            <div>
                <select className="ui right labeled dropdown"
                    placeholder="Nationality"
                    value={selectedCountry}
                    onChange={this.handleNationalityChange}
                    name="nationality">
                    <option value="">Select your nationality</option>
                    {countriesOptions}
                </select>
                </div>
            </React.Fragment>
        );
        
    }
}