/* Experience section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newExperienceData: [],
            experienceViewModel: {
                id: '',
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end: ''
            },
            formErrors: { companyErrors: '', positionErrors: '', responsibilitiesErrors: '', startErrors: '', endErrors: '' },
            experienceCompanyValid: false,
            experiencePositionValid: false,
            experienceResponsibilitiesValid: false,
            experienceStartValid: false,
            experienceEndValid: false,
            showExperienceAddSection: false,
            selectedExperienceToEdit: null,
            newExperienceDataInitialized: false
        }
        this.renderExperienceAddSection = this.renderExperienceAddSection.bind(this);
        this.handleExperienceChange = this.handleExperienceChange.bind(this);
        this.getCurrentRecord = this.getCurrentRecord.bind(this);
        this.openEditExperience = this.openEditExperience.bind(this);
        this.closeEditExperience = this.closeEditExperience.bind(this);
        this.openAddExperience = this.openAddExperience.bind(this);
        this.closeAddExperience = this.closeAddExperience.bind(this);
        this.deleteExperience = this.deleteExperience.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.saveExperience = this.saveExperience.bind(this);
        this.errorClass = this.errorClass.bind(this);
        this.validateField = this.validateField.bind(this);
        this.validateDate = this.validateDate.bind(this);
        this.InitializeMainDataSet = this.InitializeMainDataSet.bind(this);
        this.getDateWithMonthNames = this.getDateWithMonthNames.bind(this);
        this.getDatePartOnly = this.getDatePartOnly.bind(this);
        this.generateExperienceId = this.generateExperienceId.bind(this);
    }


    handleExperienceChange(event) {
        let data = Object.assign({}, this.state.experienceViewModel);
        let name = event.target.name;
        let value = event.target.value;

        data[name] = value;
        // data[id] = event.data.id;

        // Final Data To Be Changed at the time of final save...
        this.setState({
            experienceViewModel: data
        }, this.validateField(name, value));

    }

    // Initialize 'state' variables if not 'initialized' as 'props' values can not be used to maintain 'state'
    InitializeMainDataSet() {
        if (!this.state.newExperienceDataInitialized) {
            this.setState({
                newExperienceData: this.props.experienceData,
                newExperienceDataInitialized: true
            }, () => console.log("State Data Updated..."));
        }
    }
    // Validate the field values
    validateField(fieldName, value, funcName) {
        let isExperienceCompanyValid = this.state.experienceCompanyValid;
        let isExperiencePositionValid = this.state.experiencePositionValid;
        let isExperienceResponsibilitiesValid = this.state.experienceResponsibilitiesValid;
        let isExperienceStartValid = this.state.experienceStartValid;
        let isExperienceEndValid = this.state.experienceEndValid;
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;


        switch (fieldName) {
            case 'company':
                isExperienceCompanyValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.companyErrors = isExperienceCompanyValid ? '' : ' is invalid';
                isValueValidated = isExperienceCompanyValid;
                this.setState({ experienceCompanyValid: isExperienceCompanyValid }, () => console.log("Experience Company Validated"));
                break;
            case 'position':
                isExperiencePositionValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.positionErrors = isExperiencePositionValid ? '' : ' is invalid';
                isValueValidated = isExperiencePositionValid;
                this.setState({ experiencePositionValid: isExperiencePositionValid }, () => console.log("Experience Position Validated"));
                break;
            case 'responsibilities':
                isExperienceResponsibilitiesValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.responsibilitiesErrors = isExperienceResponsibilitiesValid ? '' : ' is invalid';
                isValueValidated = isExperienceResponsibilitiesValid;
                this.setState({ experienceResponsibilitiesValid: isExperienceResponsibilitiesValid }, () => console.log("Experience Responsibilities Validated"));
                break;
            case 'start':
                isExperienceStartValid = this.validateDate(value);
                isValueValidated = isExperienceStartValid;
                fieldValidationErrors.startErrors = isExperienceStartValid ? '' : ' is invalid';
                break;
            case 'end':
                isExperienceEndValid = this.validateDate(value);
                isValueValidated = isExperienceEndValid;
                fieldValidationErrors.endErrors = isExperienceEndValid ? '' : ' is invalid';
                break;
            default:
                break;
        }

        if ((isExperienceCompanyValid) && (isExperiencePositionValid) && (isExperienceResponsibilitiesValid) && (isExperienceStartValid) && (isExperienceEndValid)) {
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
        if (funcName == "updateWithoutSave") {
            return isValueValidated;
        }
    };

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

    //return an array of values that match on a certain key
    getCurrentRecord(obj, key) {

        var searchedRecord = [];
        // iterate over each element in the array
        for (var i = 0; i < obj.length; i++) {
            // look for the entry with a matching `code` value
            if (obj[i].id == key) {
                searchedRecord = obj[i];
            }
        }
        return searchedRecord;
    }

    // Displays 'Error' 
    errorClass(error) {
        return (error.length === 0 ? false : true);
    };

    // Generates the blank record
    openAddExperience() {

        // clear the existing values of the 'experienceViewModel' state object
        let blankExperienceViewModel = Object.assign({}, this.state.experienceViewModel);
        blankExperienceViewModel.id = '';
        blankExperienceViewModel.company = '';
        blankExperienceViewModel.position = '';
        blankExperienceViewModel.responsibilities = '';
        blankExperienceViewModel.start = '';
        blankExperienceViewModel.end = '';
        // Initialize data in the 'state' variable
        this.InitializeMainDataSet();

        this.setState({
            experienceViewModel: blankExperienceViewModel,
            showExperienceAddSection: true
        }, console.log("blank record generated..."));
    }

    closeAddExperience() {
        this.setState({
            showExperienceAddSection: false
        });
    }

    openEditExperience(experienceId) {
        // assigning 'experienceId' to 'dataOperationExperienceId' automatically asigns the existing value to the rendered objects...
        let dataToSearch;
        this.InitializeMainDataSet();
        // use 'props' data when 'state' variables does not exists...
        if (!this.state.newExperienceDataInitialized) {
            dataToSearch = this.props.experienceData
        }
        else {
            dataToSearch = this.state.newExperienceData
        }
        // Get the current record
        let currentRecordToEdit = this.getCurrentRecord(dataToSearch, experienceId);

        this.setState({
            selectedExperienceToEdit: experienceId,
            experienceViewModel: Object.assign({}, currentRecordToEdit)
        });
    }

    closeEditExperience(experienceId) {
        this.setState({
            selectedExperienceToEdit: null
        });
    }

    deleteExperience(experienceId) {
        let userPrompt = confirm("Do you want to delete the experience with id: " + experienceId);
        if (userPrompt) {
            let existingData = this.state.newExperienceData;
            for (var i = 0; i < existingData.length; i++) {
                if (existingData[i].id == experienceId) {
                    existingData.splice(i, 1);
                    //  console.log("Cached Data After Selected Record Removal: " + JSON.stringify(existingData))
                }
            }
            this.setState({ newExperienceData: existingData }, () => this.saveExperience('Delete'));
        }
    }

    // Adds the new record to the main dataset or updates the existing record if found
    updateWithoutSave(newExperienceRecord) {

        // Validate the NewExperienceRecordValues First...
        let totalFieldsToValidate = 5;
        let trueValidationCounts = 0;
        let falseValidationCounts = 0;
        let funcReturnValue;
        let newExperienceId;
        Object.keys(newExperienceRecord).forEach((key) => {
            funcReturnValue = false;
            funcReturnValue = this.validateField(key, newExperienceRecord[key], "updateWithoutSave");
            //console.log("Field Name: " + key + ", Validation: " + funcReturnValue);
            if (funcReturnValue) {
                trueValidationCounts += 1;
            }
            else {
                falseValidationCounts += 1;
            }
        });

        // If all values are correct then update it to the cached data...
        if (totalFieldsToValidate == trueValidationCounts) {

            let dataToUpdate = this.state.newExperienceData;
            //    console.log("dataToUpdate: " + JSON.stringify(dataToUpdate));
            // Add New Record 
            if (newExperienceRecord.id == '') {
                
                // Generate a new key value until the it's unique in the list
                do {
                    newExperienceId = this.generateExperienceId(24);
                  //  alert(newExperienceId);
                } while (!this.getCurrentRecord(dataToUpdate, newExperienceId));

                newExperienceRecord.id = newExperienceId;
                dataToUpdate.push(newExperienceRecord);
            }
            else {
                // Edit Existing Record
                for (var i = 0; i < dataToUpdate.length; i++) {
                    // look for the entry with a matching `code` value
                    if (dataToUpdate[i].id == newExperienceRecord.id) {
                        dataToUpdate[i].company = newExperienceRecord.company;
                        dataToUpdate[i].position = newExperienceRecord.position;
                        dataToUpdate[i].responsibilities = newExperienceRecord.responsibilities;
                        dataToUpdate[i].start = newExperienceRecord.start;
                        dataToUpdate[i].end = newExperienceRecord.end;
                    }
                }

            }
            this.setState({
                newExperienceData: dataToUpdate,
                //                showExperienceAddSection: false,
            }, () => { console.log("Data Cache UpToDate") });


            return true;
        }
        else {
            TalentUtil.notification.show("Data validation Errors -- Profile can not be updated", "error", null, null)
            return false;
        }

    }

    // This function should return the date in "dd MMM yyyy" or "dd MMMM yyyy" format
    // partOrFullMonthName: '1' returns short month name & '2' returns full month name
    getDateWithMonthNames(dateValue, partOrFullMonthName) {
        let retValue;
        let shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let objDate = new Date(dateValue);

        if (dateValue) {
            if (partOrFullMonthName == 1) {
                retValue = objDate.getDate().toString() + " " + shortMonthNames[objDate.getMonth()].toString() + " " + objDate.getFullYear().toString();
            }
            else {
                retValue = objDate.getDate().toString() + " " + fullMonthNames[objDate.getMonth()].toString() + " " + objDate.getFullYear().toString();
            }
        }


        return retValue;
    }

    // Returns the date part in 'YYYY/MM/DD' format
    getDatePartOnly(dateValue) {
        let retValue;
        let objDate = new Date(dateValue);

        if (dateValue) {
            retValue = objDate.getFullYear().toString() + "/" + (objDate.getMonth() + 1).toString() + "/"+ objDate.getDate().toString();
        }

        return retValue;
    }

    // Generates new experience id
    generateExperienceId(len) {
        //var experienceId = "";
        //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //for (var i = 0; i < noOfChars; i++)
        //    experienceId += possible.charAt(Math.floor(Math.random() * possible.length));

        //return experienceId;

        // Generates a hex string of specified length
        var maxlen = 8;
        var min = Math.pow(16, Math.min(len, maxlen) - 1);
        var max = Math.pow(16, Math.min(len, maxlen)) - 1;
        var n = Math.floor(Math.random() * (max - min + 1)) + min;
        var r = n.toString(16);
        while (r.length < len) {
            r = r + this.generateExperienceId(len - maxlen);
        }
        return r;

    }

    // Saves the data to the database...
    saveExperience(dataOperationMode) {
        let dataValidationsChecked = false;
        // Get the current 'sub-record' 
        let recToAddOrUpdate = Object.assign({}, this.state.experienceViewModel);
        if (dataOperationMode != 'Delete') {
            dataValidationsChecked = this.updateWithoutSave(recToAddOrUpdate);
        }
        // Update the data if data validations checked in 'Add' or 'Update' mode 
        // Update the data directly if its in 'delete' mode...
        if ((dataValidationsChecked) || (dataOperationMode == 'Delete')) {

            let data = {};
            // The whole record object with one or more sub-records
            data.experience = this.state.newExperienceData;

            this.props.controlFunc(this.props.componentId, data)
            this.closeEditExperience();
            this.closeAddExperience()

        }

    }

    render() {

        //console.log("Render called");
        //let experienceDataList = this.state.newExperienceData;
        let experienceDataList = this.props.experienceData;
        //console.log("this.props.experienceData: " + JSON.stringify(this.props.experienceData));
        let selectedExperienceToEdit = this.state.selectedExperienceToEdit;
        let tableData = null;
        let addNewExperienceContent = this.state.showExperienceAddSection ? this.renderExperienceAddSection() : null;

        //
        if (experienceDataList) {
            tableData = experienceDataList.map((experienceRecord) =>
                <tr key={experienceRecord.id}>
                    {
                        ((selectedExperienceToEdit) && (selectedExperienceToEdit == experienceRecord.id))
                            ?
                            (
                            <td colSpan="6">
                                    <table className="ui striped table full-width-table custom-table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={120}
                                                        label="Company"
                                                        name="company"
                                                        value={this.state.experienceViewModel.company}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter a company name"
                                                        isError={this.errorClass(this.state.formErrors.companyErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>

                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={120}
                                                        label="Position"
                                                        name="position"
                                                        value={this.state.experienceViewModel.position}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter your position"
                                                        isError={this.errorClass(this.state.formErrors.positionErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={50}
                                                        label="Start Date"
                                                        name="start"
                                                        value={this.getDatePartOnly(this.state.experienceViewModel.start)}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter start date in YYYY/MM/DD Format"
                                                        isError={this.errorClass(this.state.formErrors.startErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>

                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={50}
                                                        label="End Date"
                                                        name="end"
                                                        value={this.getDatePartOnly(this.state.experienceViewModel.end)}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter end date in YYYY/MM/DD Format"
                                                        isError={this.errorClass(this.state.formErrors.endErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={300}
                                                        label="Responsibilities"
                                                        name="responsibilities"
                                                        value={this.state.experienceViewModel.responsibilities}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter your responsibilities"
                                                        isError={this.errorClass(this.state.formErrors.responsibilitiesErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <div className="inline-controls">
                                                        <button type="button" className="ui teal button" onClick={this.saveExperience.bind(this)}>Update</button>
                                                        <button type="button" className="ui button" onClick={this.closeEditExperience.bind(this)}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                            )
                            :
                            (<td colSpan="6">
                                <table className="full-width-table">
                                    <tbody>
                                        <tr>
                                            <td >
                                                {experienceRecord.company}
                                            </td>
                                            <td>
                                                {experienceRecord.position}
                                            </td>
                                            <td>
                                                {experienceRecord.responsibilities}
                                            </td>
                                            <td>
                                                {this.getDateWithMonthNames(experienceRecord.start,1)}
                                            </td>
                                            <td>
                                                {this.getDateWithMonthNames(experienceRecord.end,1)}
                                            </td>
                                            <td>
                                                <div className="inline-controls"><i className="outline write icon" onClick={this.openEditExperience.bind(this, experienceRecord.id)}></i>
                                                    <i className="remove icon" onClick={this.deleteExperience.bind(this, experienceRecord.id)}></i></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>)

                    }
                </tr>
            );
        }

        return (
            <React.Fragment>
                {addNewExperienceContent}
                <div className="container fluid">
                    <table className="ui striped table full-width-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Responsibilities</th>
                                <th>Start</th>
                                <th>End</th>
                                <th className="right aligned">
                                    <button type="button" className="ui teal button" onClick={this.openAddExperience.bind(this)}>
                                        <i className="plus icon"></i>
                                        Add New
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }

    renderExperienceAddSection() {
        return (
            <React.Fragment>
                <div>
                    <table className="ui striped table full-width-table">
                        <tbody>
                            <tr>
                                <td colSpan="6">

                                    <table className="ui striped table full-width-table custom-table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={120}
                                                        label="Company"
                                                        name="company"
                                                        value={this.state.experienceViewModel.company}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter a company name"
                                                        isError={this.errorClass(this.state.formErrors.companyErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>

                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={120}
                                                        label="Position"
                                                        name="position"
                                                        value={this.state.experienceViewModel.position}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter your position"
                                                        isError={this.errorClass(this.state.formErrors.positionErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={50}
                                                        label="Start Date"
                                                        name="start"
                                                        value={this.state.experienceViewModel.start}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter start date in YYYY/MM/DD Format"
                                                        isError={this.errorClass(this.state.formErrors.startErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>

                                                <td>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={50}
                                                        label="End Date"
                                                        name="end"
                                                        value={this.state.experienceViewModel.end}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter end date in YYYY/MM/DD Format"
                                                        isError={this.errorClass(this.state.formErrors.endErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        maxLength={300}
                                                        label="Responsibilities"
                                                        name="responsibilities"
                                                        value={this.state.experienceViewModel.responsibilities}
                                                        controlFunc={this.handleExperienceChange}
                                                        errorMessage="Please enter your responsibilities"
                                                        isError={this.errorClass(this.state.formErrors.responsibilitiesErrors)}
                                                    >
                                                    </ChildSingleInput>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">
                                                    <div className="inline-controls">
                                                        <button type="button" className="ui teal button" onClick={this.saveExperience.bind(this)}>Add</button>
                                                        <button type="button" className="ui button" onClick={this.closeAddExperience.bind(this)}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>

                            </tr>
                        </tbody>
                    </table>

                </div>
            </React.Fragment>
        );
    }


}
