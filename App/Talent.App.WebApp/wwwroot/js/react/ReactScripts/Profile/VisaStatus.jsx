import React from 'react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            newVisaStatusDetails: {
                visaStatus: '',
                visaExpiryDate: ''
            },
            formErrors: { visaStatusErrors: '', visaExpiryDateErrors: '' },
            visaStatusValid: false,
            visaExpiryDateValid: false,
            formValid: true,
            isInDataChangeMode: false,
            isStateInitialized: false
        }
        this.handleVisaStatusChange = this.handleVisaStatusChange.bind(this);
        this.saveVisaStatusData = this.saveVisaStatusData.bind(this);
        this.errorClass = this.errorClass.bind(this);
        this.saveVisaStatusData = this.saveVisaStatusData.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateDate = this.validateDate.bind(this);
        this.getDatePartOnly = this.getDatePartOnly.bind(this);
        this.InitializeStateDataSet = this.InitializeStateDataSet.bind(this);
    }

    // componentDidUpdate(prevProps, prevState){} = event to intialize the state variable


    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    handleVisaStatusChange(event) {

        let name = event.target.name;
        let value = event.target.value;

        // console.log("handleVisaStatusChange: name: " + name + ", value: " + value);

        if (!this.state.isStateInitialized) {
            this.InitializeStateDataSet();
        }

        let data = Object.assign({}, this.state.newVisaStatusDetails)

        // console.log("handleVisaStatusChange function -> data: " + JSON.stringify(data));

        data[name] = value;

        this.setState({
            isInDataChangeMode: true,
            newVisaStatusDetails: data
        }, () => { this.saveVisaStatusData(); });

    }

    // Initializes the main state data 
    InitializeStateDataSet() {

        let copyPropsData;

        copyPropsData = {
            visaStatus: this.props.visaStatus,
            visaExpiryDate: this.props.visaExpiryDate
        }
        this.setState({
            newVisaStatusDetails: copyPropsData,
            isStateInitialized: true
        }, () => console.log("State Data Initialized..."));
        
    }

    // This function should return 'true' or 'false' as it's been called as an annonymous function in the 'setState' method...
    saveVisaStatusData(saveFinalData) {

        let validationReturnValue;
        let totalFieldsToValidate = 2;
        let trueValidationCounts = 0;
        let data = Object.assign({}, this.state.newVisaStatusDetails);
        let isDataInChangeMode, visaStatusFieldValue;
        
       
        if (saveFinalData) {
            isDataInChangeMode = false;
        }
        // (data.visaStatus == 'work visa') ? (totalFieldsToValidate = 2) : (totalFieldsToValidate = 1)
        //data = this.state.newVisaStatusDetails;
        if (!(data['visaStatus'] == 'work visa' && data['visaExpiryDate'] == '')) {

            Object.keys(data).forEach((key) => {
                validationReturnValue = false;
              //  visaStatusFieldValue = (data[key] == "visaExpiryDate") ? data['visaStatus'] : null;
            
                validationReturnValue = this.validateField(key, data[key], "saveVisaStatusData");
                console.log("saveVisaStatusData function. Field Name: " + key + ", value: " + data[key] + ", Validation: " + validationReturnValue);
                if (validationReturnValue) {
                    trueValidationCounts += 1;
                }
            });
        }
        // Don't update the data or display error message while the user is typing a text for 'visa date'
        if ((totalFieldsToValidate == trueValidationCounts) && (!isDataInChangeMode)) {
            this.props.controlFunc(this.props.componentId, data)
            return true;        
        }
        else {
            if (!isDataInChangeMode) {
                TalentUtil.notification.show("Data validation Errors -- Profile can not be updated", "error", null, null)
            }
            return false;
        }

    }

    // Validates the filed values based on fieldName and if the calling function is 'saveVisaStatusData' then returns 'true' or 'false'
    validateField(fieldName, value, funcName) {
        let isVisaStatusValid = this.state.visaStatusValid;
        let isVisaExpiryDateValid = this.state.visaExpiryDateValid;
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;

        console.log("validateField function: fieldName: " + fieldName + ", value: " + value + ", funcName: " + funcName);
        switch (fieldName) {
            case 'visaStatus':
                isVisaStatusValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.visaStatusErrors = isVisaStatusValid ? '' : 'Please provide your visa status';
                isValueValidated = isVisaStatusValid;
                this.setState({ visaStatusValid: isVisaStatusValid }, () => console.log("Visa Status Checked"));
                break;
            case 'visaExpiryDate':
                isVisaExpiryDateValid = (value == '' || value == null) ? true : (isVisaExpiryDateValid = this.validateDate(value)) 
                isValueValidated = isVisaExpiryDateValid;
                fieldValidationErrors.visaExpiryDateErrors = isVisaExpiryDateValid ? '' : ' is invalid';
                break;
            default:
                break;
        }

        if ((isVisaStatusValid) && (isVisaExpiryDateValid)) {
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
        if (funcName == "saveVisaStatusData") {
            return isValueValidated;
        }
    };

    // Validates date in 'YYYY/MM/DD' format
    validateDate(dateValue) {

        let isDateValid = false;
        // YYYY/MM/DD; YYYY-MM-DD
        var dateReg = /^(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/igm;

        if (dateValue == '' || dateValue == null) {
            isDateValid = false;
        }
        else {
            if ((dateReg.test(dateValue))) {
                isDateValid = true;
            }
            else {
                isDateValid = false;
            }
        }

        return isDateValid;
    }

    // Returns the date part in 'YYYY/MM/DD' format
    getDatePartOnly(dateValue) {
        let retValue;
        let objDate = new Date(dateValue);

        if (dateValue) {
            retValue = objDate.getFullYear().toString() + "/" + (objDate.getMonth() + 1).toString() + "/" + objDate.getDate().toString();
        }

        return retValue;
    }

    


    render() {

    
        // retrieve the initial values from 'props' and display
        let selectedVisaStatus = this.state.isStateInitialized ? this.state.newVisaStatusDetails.visaStatus : this.props.visaStatus;
        let visaExpiryDateVal = this.state.isStateInitialized ? (this.state.newVisaStatusDetails.visaExpiryDate ? this.state.newVisaStatusDetails.visaExpiryDate : '') : (this.props.visaExpiryDate ? this.getDatePartOnly(this.props.visaExpiryDate) : '');
        return (
                <table className="full-width-table custom-table">
                    <tbody>
                        <tr>
                            <td width={'30%'}>
                                <label><b>Visa Status</b></label>
                                <select className="ui right labeled dropdown"
                                    placeholder="VisaStatus"
                                    value={selectedVisaStatus}
                                    onChange={this.handleVisaStatusChange}
                                    name="visaStatus">
                                    <option value="">Select your Visa Status</option>
                                    <option value="citizen">Citizen</option>
                                    <option value="permanent resident">Permanent Resident</option>
                                    <option value="work visa">Work Visa</option>
                                    <option value="student visa">Student Visa</option>
                                </select>
                                {this.state.formErrors.visaStatusErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.visaStatusErrors}</div> : null}
                            </td>
                            <td width={'30%'}>
                            {(selectedVisaStatus == 'work visa')
                                    ?
                                    (<ChildSingleInput
                                        inputType="text"
                                        label="Visa expiry date"
                                        name="visaExpiryDate"
                                        value={visaExpiryDateVal}
                                        controlFunc={this.handleVisaStatusChange}
                                        maxLength={50}
                                        placeholder="Visa Expiry Date"
                                        errorMessage="Please enter a valid visa expiry date in YYYY/MM/DD format"
                                        isError={this.errorClass(this.state.formErrors.visaExpiryDateErrors)}
                                    />)
                                    :
                                    ''
                                }
                            </td>
                            <td width={'20%'}>
                            {(selectedVisaStatus == 'work visa')
                                    ?
                                    (<div>
                                        <p><b>&nbsp;</b></p>
                                        <button type="button" className="ui teal button" onClick={this.saveVisaStatusData.bind(this,true)}>Save</button>
                                    </div>)
                                    :
                                    ''
                                }
                                
                             </td>   
                        </tr>
                    </tbody>
                </table>
        );

    }

    

}