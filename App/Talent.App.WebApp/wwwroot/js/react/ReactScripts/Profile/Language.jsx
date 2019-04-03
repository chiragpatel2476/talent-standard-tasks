/* Language section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

 //       let dummyData = [{ name: 'Gujarati', level: 'gujarati', id: '1', currentUserId: '' }, { name: 'English', level: 'english', id: '2', currentUserId: '' }];
 //       let languageData = this.props.languageData ? this.props.languageData : dummyData;
        //let existingLanguageData = this.props.languageData;

        //const details = props.languageData ? props.languageData : [];

        this.state = {
            newLanguageData: [],
            languageViewModel: {
                name: '',
                level:'',
                id : '',
                currentUserId:''
            },
            formErrors: { nameErrors: '', levelErrors: '' },
            languageNameValid: false,
            languageLevelValid: false,
            showLanguageAddSection: false,
            selectedLanguageToEdit: null,
            newLanguageDataInitialized: false
        }
        this.renderLanguageAddSection = this.renderLanguageAddSection.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.getCurrentRecord = this.getCurrentRecord.bind(this);
        this.openEditLanguage = this.openEditLanguage.bind(this);
        this.closeEditLanguage = this.closeEditLanguage.bind(this);
        this.openAddLanguage = this.openAddLanguage.bind(this);
        this.closeAddLanguage = this.closeAddLanguage.bind(this);
        this.deleteLanguage = this.deleteLanguage.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.saveLanguage = this.saveLanguage.bind(this);
        this.errorClass = this.errorClass.bind(this);
        this.validateField = this.validateField.bind(this);
        this.InitializeMainDataSet = this.InitializeMainDataSet.bind(this);   
        this.generateLanguageId = this.generateLanguageId.bind(this);
    }

   
    handleLanguageChange(event) {
        let data = Object.assign({}, this.state.languageViewModel);
        let name = event.target.name;
        let value = event.target.value;

        data[name] = value;
       // data[id] = event.data.id;

        // Final Data To Be Changed at the time of final save...
        this.setState({
            languageViewModel: data
        }, this.validateField(name,value));

    }
// Initialize the 'state' data from 'props' if the flag for confirmation is false
    InitializeMainDataSet() {
        if (!this.state.newLanguageDataInitialized) {
                this.setState({
                    newLanguageData: this.props.languageData,
                    newLanguageDataInitialized: true
                }, () => console.log("State Data Updated..." ));
        }
    }
    // Validate the field values
    validateField(fieldName, value, funcName) {
        let isLanguageNameValid = this.state.languageNameValid;
        let islanguageLevelValid = this.state.languageLevelValid;
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;

        switch (fieldName) {
            case 'name':
                isLanguageNameValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.nameErrors = isLanguageNameValid ? '' : ' is invalid';
                isValueValidated = isLanguageNameValid;
                this.setState({ languageNameValid: isLanguageNameValid }, () => console.log("Language Name Validated"));
                break;
            case 'level':
                islanguageLevelValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.levelErrors = islanguageLevelValid ? '' : 'Please select a language level';
                isValueValidated = islanguageLevelValid;
                this.setState({ languageLevelValid: islanguageLevelValid }, () => console.log("Language Level Validated"));
                break;
            default:
                break;
        }

        if ((isLanguageNameValid) && (islanguageLevelValid)) {
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
    openAddLanguage() {

        // clear the values of the 'languageViewModel' state object
        let blankLanguageViewModel = Object.assign({}, this.state.languageViewModel);
        blankLanguageViewModel.id = '';
        blankLanguageViewModel.name = '';
        blankLanguageViewModel.level = '';

        this.InitializeMainDataSet();

        this.setState({
            languageViewModel: blankLanguageViewModel,
            showLanguageAddSection: true
        }, console.log("blank record generated..."));
    }

    closeAddLanguage() {
        this.setState({
            showLanguageAddSection: false
        });
    }

    openEditLanguage(languageId) {
        // assigning 'languageId' to 'dataOperationLanguageId' automatically asigns the existing value to the rendered objects...
        let dataToSearch;
        this.InitializeMainDataSet();
        // retrieve the values from 'props' if 'state' variable is not initialized...
        if (!this.state.newLanguageDataInitialized) {
            dataToSearch = this.props.languageData
        }
        else {
            dataToSearch = this.state.newLanguageData
        }
        // Get the values of current sub-record
        let currentRecordToEdit = this.getCurrentRecord(dataToSearch, languageId);

        this.setState({
            selectedLanguageToEdit: languageId,
            languageViewModel: Object.assign({}, currentRecordToEdit)
        });
    }

    closeEditLanguage(languageId) {
        this.setState({
            selectedLanguageToEdit: null
        });
    }

    deleteLanguage(languageId) {
        let userPrompt = confirm("Do you want to delete the language with id: " + languageId);
        if (userPrompt) {
            let existingData = this.state.newLanguageData;
            for (var i = 0; i < existingData.length; i++) {
                if (existingData[i].id == languageId) {
                    existingData.splice(i, 1);
                    // console.log("Cached Data After Selected Record Removal: " + JSON.stringify(existingData))
                }
            }
            this.setState({ newLanguageData: existingData }, () => this.saveLanguage('Delete'));
        }
    }

    // Adds the new record to the main dataset or updates the existing record if found
    updateWithoutSave(newLanguageRecord) {

        // Validate the NewLanguageRecordValues First...
        let totalFieldsToValidate = 2;
        let trueValidationCounts = 0;
        let falseValidationCounts = 0;
        let funcReturnValue;
        let newLanguageId;

        Object.keys(newLanguageRecord).forEach((key) => {
            funcReturnValue = false;
            funcReturnValue = this.validateField(key, newLanguageRecord[key], "updateWithoutSave");
            if (funcReturnValue) {
                trueValidationCounts += 1;
            }
            else {
                falseValidationCounts += 1;
            }
        });

        // If all values are correct then update it to the cached data...
        if (totalFieldsToValidate == trueValidationCounts) {

            let dataToUpdate = this.state.newLanguageData;
            //    console.log("dataToUpdate: " + JSON.stringify(dataToUpdate));
            // Add New Record 
            if (newLanguageRecord.id == '') {
                // Generate a new key value until the it's unique in the list
                do {
                    newLanguageId = this.generateLanguageId(24);
                  //  alert(newLanguageId);
                } while (!this.getCurrentRecord(dataToUpdate, newLanguageId));

                newLanguageRecord.id = newLanguageId;
                dataToUpdate.push(newLanguageRecord);
            }
            else {
                // Edit Existing Record
                for (var i = 0; i < dataToUpdate.length; i++) {
                    // look for the entry with a matching `code` value
                    if (dataToUpdate[i].id == newLanguageRecord.id) {
                        dataToUpdate[i].name = newLanguageRecord.name;
                        dataToUpdate[i].level = newLanguageRecord.level;
                    }
                }

            }
            this.setState({
                newLanguageData: dataToUpdate,
                //                showLanguageAddSection: false,
            }, () => { console.log("Data Cache UpToDate") });


            return true;
        }
        else {
            TalentUtil.notification.show("Data validation Errors -- Profile can not be updated", "error", null, null)
            return false;
        }

    }

    // Generates new language id
    generateLanguageId(len) {
        //var languageId = "";
        //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //for (var i = 0; i < noOfChars; i++)
        //    languageId += possible.charAt(Math.floor(Math.random() * possible.length));

        //return languageId;

        // Generates a hex string of specified length
        var maxlen = 8;
        var min = Math.pow(16, Math.min(len, maxlen) - 1);
        var max = Math.pow(16, Math.min(len, maxlen)) - 1;
        var n = Math.floor(Math.random() * (max - min + 1)) + min;
        var r = n.toString(16);
        while (r.length < len) {
            r = r + this.generateLanguageId(len - maxlen);
        }
        return r;

    }

    // Saves the data to the database...
    saveLanguage(dataOperationMode) {
        let dataValidationsChecked = false;
        let recToAddOrUpdate = Object.assign({}, this.state.languageViewModel);
        if (dataOperationMode != 'Delete') {
            dataValidationsChecked = this.updateWithoutSave(recToAddOrUpdate);
        }
        // Update the data if data validations checked in 'Add' or 'Update' mode 
        // Update the data directly if its in 'delete' mode...
        if ((dataValidationsChecked) || (dataOperationMode == 'Delete')) {

            let data = {};
            data.languages = this.state.newLanguageData;

            this.props.controlFunc(this.props.componentId, data)
            this.closeEditLanguage();
            this.closeAddLanguage()
            
        }

    }

    render() {

        //console.log("Render called");
        //let languageDataList = this.state.newLanguageData;
        let languageDataList = this.props.languageData;
        //console.log("this.props.languageData: " + JSON.stringify(this.props.languageData));
        let selectedLanguageToEdit = this.state.selectedLanguageToEdit;
        let tableData = null;
        let addNewLanguageContent = this.state.showLanguageAddSection ? this.renderLanguageAddSection() : null;
        
        //
        if (languageDataList) {
            tableData = languageDataList.map((languageRecord) => 
                <tr key={languageRecord.id}>
                    <td className="four wide">
                        {(
                            ((selectedLanguageToEdit) && (selectedLanguageToEdit == languageRecord.id))
                                ?  
                                (<ChildSingleInput
                                    inputType="text"
                                    maxLength={50}
                                    name="name"
                                    value={this.state.languageViewModel.name}
                                    controlFunc={this.handleLanguageChange}
                                    errorMessage="Please enter a language"
                                    isError={this.errorClass(this.state.formErrors.nameErrors)}
                                >
                                </ChildSingleInput>)
                                :
                                languageRecord.name
                        )}
                    </td>
                    <td className="four wide">
                        {(
                            ((selectedLanguageToEdit) && (selectedLanguageToEdit == languageRecord.id))
                                ?
                                (<span><select className="ui right labeled dropdown"
                                    placeholder="Language Level"
                                    value={this.state.languageViewModel.level}
                                    onChange={this.handleLanguageChange}
                                    name="level">
                                    <option value="">Language Level</option>
                                    <option value="basic">Basic</option>
                                    <option value="conversational">Conversational</option>
                                    <option value="fluent">Fluent</option>
                                    <option value="native/bilingual">Native/Bilingual</option>
                                </select>
                                    {this.state.formErrors.levelErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.levelErrors}</div> : null}
                                </span>)
                                :
                                languageRecord.level
                )}
                
                    </td>
                    <td className="four wide">
                        {((selectedLanguageToEdit) && (selectedLanguageToEdit == languageRecord.id))
                            ?

                            (<div className="inline-controls">
                                <button type="button" className="ui blue basic button" onClick={this.saveLanguage.bind(this)}>Update</button>
                                <button type="button" className="ui red basic button" onClick={this.closeEditLanguage.bind(this)}>Cancel</button>
                            </div>)
                            :
                            null}
                    </td>
                    <td className="four wide right aligned">
                        {((selectedLanguageToEdit) && (selectedLanguageToEdit == languageRecord.id))
                            ?
                            null
                            :
                            (<div><i className="outline write icon" onClick={this.openEditLanguage.bind(this, languageRecord.id)}></i>
                                <i className="remove icon" onClick={this.deleteLanguage.bind(this, languageRecord.id)}></i></div>)}
                    </td>
                </tr>
            );
        }
        return (
            <React.Fragment>
                {addNewLanguageContent}
                <div className="container fluid">
                    <table className="ui striped table full-width-table">
                        <thead>
                            <tr>
                                <th className="four wide">Language</th>
                                <th className="four wide">Level</th>
                                <th className="four wide"></th>
                                <th className="four wide right aligned">
                                    <button type="button" className="ui teal button" onClick={this.openAddLanguage.bind(this)}>
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

    renderLanguageAddSection() {
        return (
            <React.Fragment>
                <div>
                    <table className="ui striped table full-width-table">
                        <tbody>
                        <tr>
                            <td className="four wide">
                                <ChildSingleInput
                                inputType="text"
                                maxLength={50}
                                name="name"
                                value={this.state.languageViewModel.name}
                                controlFunc={this.handleLanguageChange}
                                errorMessage="Please enter a language"
                                isError={this.errorClass(this.state.formErrors.nameErrors)}
                                >
                                </ChildSingleInput>
                            </td>
                            <td className="four wide">
                                <span><select className="ui right labeled dropdown"
                                    placeholder="Language Level"
                                    value={this.state.languageViewModel.level}
                                    onChange={this.handleLanguageChange}
                                    name="level">
                                    <option value="">Language Level</option>
                                    <option value="basic">Basic</option>
                                    <option value="conversational">Conversational</option>
                                    <option value="fluent">Fluent</option>
                                    <option value="native/bilingual">Native/Bilingual</option>
                                </select>
                                    {this.state.formErrors.levelErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.levelErrors}</div> : null}
                                </span>
                            </td>
                            <td className="four wide">
                                <button type="button" className="ui teal button" onClick={this.saveLanguage.bind(this)}>Add</button>
                                <button type="button" className="ui button" onClick={this.closeAddLanguage.bind(this)}>Cancel</button>
                            </td>
                            <td className="four wide">
                            
                            </td>
                            </tr>
                            </tbody>
                </table>

            </div>
            </React.Fragment>
        );
    }

   
}