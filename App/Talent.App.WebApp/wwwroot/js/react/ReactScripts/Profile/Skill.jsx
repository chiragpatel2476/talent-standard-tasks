/* Skill section */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import Cookies from 'js-cookie';

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
      
        this.state = {
            newSkillData: [],
            skillViewModel: {
                id: '',
                name: '',
                level: ''
            },
            formErrors: { nameErrors: '', levelErrors: '' },
            skillNameValid: false,
            skillLevelValid: false,
            showSkillAddSection: false,
            selectedSkillToEdit: null,
            newSkillDataInitialized: false
        }
        this.renderSkillAddSection = this.renderSkillAddSection.bind(this);
        this.handleSkillChange = this.handleSkillChange.bind(this);
        this.getCurrentRecord = this.getCurrentRecord.bind(this);
        this.openEditSkill = this.openEditSkill.bind(this);
        this.closeEditSkill = this.closeEditSkill.bind(this);
        this.openAddSkill = this.openAddSkill.bind(this);
        this.closeAddSkill = this.closeAddSkill.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.saveSkill = this.saveSkill.bind(this);
        this.errorClass = this.errorClass.bind(this);
        this.validateField = this.validateField.bind(this);
        this.InitializeMainDataSet = this.InitializeMainDataSet.bind(this);
        this.generateSkillId = this.generateSkillId.bind(this);
    }


    handleSkillChange(event) {
        let data = Object.assign({}, this.state.skillViewModel);
        let name = event.target.name;
        let value = event.target.value;

        data[name] = value;
        // data[id] = event.data.id;

        // Final Data To Be Changed at the time of final save...
        this.setState({
            skillViewModel: data
        }, this.validateField(name, value));

    }
    // Initialize 'state' variable data if 'flag' variable is 'false'
    InitializeMainDataSet() {
        if (!this.state.newSkillDataInitialized) {
            this.setState({
                newSkillData: this.props.skillData,
                newSkillDataInitialized: true
            }, () => console.log("State Data Updated..."));
        }
    }
    // Validate the field values
    validateField(fieldName, value, funcName) {
        let isSkillNameValid = this.state.skillNameValid;
        let isskillLevelValid = this.state.skillLevelValid;
        let fieldValidationErrors = this.state.formErrors;
        var formValid = this.state.formValid;
        let isValueValidated = false;

        switch (fieldName) {
            case 'name':
                isSkillNameValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.nameErrors = isSkillNameValid ? '' : ' is invalid';
                isValueValidated = isSkillNameValid;
                this.setState({ skillNameValid: isSkillNameValid }, () => console.log("Skill Name Validated"));
                break;
            case 'level':
                isskillLevelValid = (value == '' || value == null) ? false : true;
                fieldValidationErrors.levelErrors = isskillLevelValid ? '' : 'Please select a skill level';
                isValueValidated = isskillLevelValid;
                this.setState({ skillLevelValid: isskillLevelValid }, () => console.log("Skill Level Validated"));
                break;
            default:
                break;
        }

        if ((isSkillNameValid) && (isskillLevelValid)) {
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
    openAddSkill() {

        // clear the values of the 'skillViewModel' state object
        let blankSkillViewModel = Object.assign({}, this.state.skillViewModel);
        blankSkillViewModel.id = '';
        blankSkillViewModel.name = '';
        blankSkillViewModel.level = '';

        this.InitializeMainDataSet();

        this.setState({
            skillViewModel: blankSkillViewModel,
            showSkillAddSection: true
        }, console.log("blank record generated..."));
    }

    closeAddSkill() {
        this.setState({
            showSkillAddSection: false
        });
    }

    openEditSkill(skillId) {
        // assigning 'skillId' to 'dataOperationSkillId' automatically asigns the existing value to the rendered objects...
        let dataToSearch;
        this.InitializeMainDataSet();
        // Retrieve the values from 'props' if state variable is not initialized...
        if (!this.state.newSkillDataInitialized) {
            dataToSearch = this.props.skillData
        }
        else {
            dataToSearch = this.state.newSkillData
        }
        // Retrieve the current sub-record...
        let currentRecordToEdit = this.getCurrentRecord(dataToSearch, skillId);

        this.setState({
            selectedSkillToEdit: skillId,
            skillViewModel: Object.assign({}, currentRecordToEdit)
        });
    }

    closeEditSkill(skillId) {
        this.setState({
            selectedSkillToEdit: null
        });
    }

    deleteSkill(skillId) {
        let userPrompt = confirm("Do you want to delete the skill with id: " + skillId);
        if (userPrompt) {
            let existingData = this.state.newSkillData;
            for (var i = 0; i < existingData.length; i++) {
                if (existingData[i].id == skillId) {
                    existingData.splice(i, 1);
//                    console.log("Cached Data After Selected Record Removal: " + JSON.stringify(existingData))
                }
            }
            this.setState({ newSkillData: existingData }, () => this.saveSkill('Delete'));
        }
    }

    // Adds the new record to the main dataset or updates the existing record if found
    updateWithoutSave(newSkillRecord) {

        // Validate the NewSkillRecordValues First...
        let totalFieldsToValidate = 2;
        let trueValidationCounts = 0;
        let falseValidationCounts = 0;
        let funcReturnValue;
        let newSkillId;
        // Validate values from sub-record
        Object.keys(newSkillRecord).forEach((key) => {
            funcReturnValue = false;
            funcReturnValue = this.validateField(key, newSkillRecord[key], "updateWithoutSave");
            if (funcReturnValue) {
                trueValidationCounts += 1;
            }
            else {
                falseValidationCounts += 1;
            }
        });

        // If all values are correct then update it to the cached data...
        if (totalFieldsToValidate == trueValidationCounts) {

            let dataToUpdate = this.state.newSkillData;
            //    console.log("dataToUpdate: " + JSON.stringify(dataToUpdate));
            // Add New Record 
            if (newSkillRecord.id == '') {
                // Generate a new key value until the it's unique in the list
                do {
                    newSkillId = this.generateSkillId(24);
                 //   alert(newSkillId);
                } while (!this.getCurrentRecord(dataToUpdate, newSkillId));

                newSkillRecord.id = newSkillId;
                dataToUpdate.push(newSkillRecord);
            }
            else {
                // Edit Existing Record
                for (var i = 0; i < dataToUpdate.length; i++) {
                    // look for the entry with a matching `code` value
                    if (dataToUpdate[i].id == newSkillRecord.id) {
                        dataToUpdate[i].name = newSkillRecord.name;
                        dataToUpdate[i].level = newSkillRecord.level;
                    }
                }

            }
            this.setState({
                newSkillData: dataToUpdate,
                //                showSkillAddSection: false,
            }, () => { console.log("Data Cache UpToDate") });


            return true;
        }
        else {
            TalentUtil.notification.show("Data validation Errors -- Profile can not be updated", "error", null, null)
            return false;
        }

    }

   

    // Generates new skill id
    generateSkillId(len) {
        //var skillId = "";
        //var possible = "0123456789abcdefghijklmnopqrstuvwxyz";

        //for (var i = 0; i < noOfChars; i++)
        //    skillId += possible.charAt(Math.floor(Math.random() * possible.length));

        //return skillId;

        // Generates a hex string of specified length
        var maxlen = 8;
        var min = Math.pow(16, Math.min(len, maxlen) - 1);
        var max = Math.pow(16, Math.min(len, maxlen)) - 1;
        var n = Math.floor(Math.random() * (max - min + 1)) + min;
        var r = n.toString(16);
        while (r.length < len) {
            r = r + this.generateSkillId(len - maxlen);
        }
        return r;
    }

    // Saves the data to the database...
    saveSkill(dataOperationMode) {
        let dataValidationsChecked = false;
        let recToAddOrUpdate = Object.assign({}, this.state.skillViewModel);
        if (dataOperationMode != 'Delete') {
            dataValidationsChecked = this.updateWithoutSave(recToAddOrUpdate);
        }
        // Update the data if data validations checked in 'Add' or 'Update' mode 
        // Update the data directly if its in 'delete' mode...
        if ((dataValidationsChecked) || (dataOperationMode == 'Delete')) {

            let data = {};
            data.skills = this.state.newSkillData;

            this.props.controlFunc(this.props.componentId, data)
            this.closeEditSkill();
            this.closeAddSkill()

        }

    }

    render() {
        //debugger
        //console.log("Render called");
        //let skillDataList = this.state.newSkillData;
        let skillDataList = this.props.skillData;
        //console.log("this.props.skillData: " + JSON.stringify(this.props.skillData));
        let selectedSkillToEdit = this.state.selectedSkillToEdit;
        let tableData = null;
        let addNewSkillContent = this.state.showSkillAddSection ? this.renderSkillAddSection() : null;

        //
        if (skillDataList) {
            tableData = skillDataList.map((skillRecord) =>
                <tr key={skillRecord.id}>
                    <td className="four wide">
                        {(
                            ((selectedSkillToEdit) && (selectedSkillToEdit == skillRecord.id))
                                ?
                                (<ChildSingleInput
                                    inputType="text"
                                    maxLength={50}
                                    name="name"
                                    value={this.state.skillViewModel.name}
                                    controlFunc={this.handleSkillChange}
                                    errorMessage="Please enter a skill"
                                    isError={this.errorClass(this.state.formErrors.nameErrors)}
                                >
                                </ChildSingleInput>)
                                :
                                skillRecord.name
                        )}
                    </td>
                    <td className="four wide">
                        {(
                            ((selectedSkillToEdit) && (selectedSkillToEdit == skillRecord.id))
                                ?
                                (<span><select className="ui right labeled dropdown"
                                    placeholder="Skill Level"
                                    value={this.state.skillViewModel.level}
                                    onChange={this.handleSkillChange}
                                    name="level">
                                    <option value="">Skill Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                </select>
                                    {this.state.formErrors.levelErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.levelErrors}</div> : null}
                                </span>)
                                :
                                skillRecord.level
                        )}

                    </td>
                    <td className="four wide">
                        {((selectedSkillToEdit) && (selectedSkillToEdit == skillRecord.id))
                            ?

                            (<div className="inline-controls">
                                <button type="button" className="ui blue basic button" onClick={this.saveSkill.bind(this)}>Update</button>
                                <button type="button" className="ui red basic button" onClick={this.closeEditSkill.bind(this)}>Cancel</button>
                            </div>)
                            :
                            null}
                    </td>
                    <td className="four wide right aligned">
                        {((selectedSkillToEdit) && (selectedSkillToEdit == skillRecord.id))
                            ?
                            null
                            :
                            (<div><i className="outline write icon" onClick={this.openEditSkill.bind(this, skillRecord.id)}></i>
                                <i className="remove icon" onClick={this.deleteSkill.bind(this, skillRecord.id)}></i></div>)}
                    </td>
                </tr>
            );
        }
        return (
            <React.Fragment>
                {addNewSkillContent}
                <div className="container fluid">
                    <table className="ui striped table full-width-table">
                        <thead>
                            <tr>
                                <th className="four wide">Skill</th>
                                <th className="four wide">Level</th>
                                <th className="four wide"></th>
                                <th className="four wide right aligned">
                                    <button type="button" className="ui teal button" onClick={this.openAddSkill.bind(this)}>
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

    renderSkillAddSection() {
        return (
            <React.Fragment>
                <div className="container fluid">
                    <table className="ui striped table full-width-table">
                        <tbody>
                            <tr>
                                <td className="four wide">
                                    <ChildSingleInput
                                        inputType="text"
                                        maxLength={50}
                                        name="name"
                                        value={this.state.skillViewModel.name}
                                        controlFunc={this.handleSkillChange}
                                        errorMessage="Please enter a skill"
                                        isError={this.errorClass(this.state.formErrors.nameErrors)}
                                    >
                                    </ChildSingleInput>
                                </td>
                                <td className="four wide">
                                    <span><select className="ui right labeled dropdown"
                                        placeholder="Skill Level"
                                        value={this.state.skillViewModel.level}
                                        onChange={this.handleSkillChange}
                                        name="level">
                                        <option value="">Skill Level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                        {this.state.formErrors.levelErrors != "" ? <div className="ui basic red pointing prompt label transition visible">{this.state.formErrors.levelErrors}</div> : null}
                                    </span>
                                </td>
                                <td className="four wide">
                                    <button type="button" className="ui teal button" onClick={this.saveSkill.bind(this)}>Add</button>
                                    <button type="button" className="ui button" onClick={this.closeAddSkill.bind(this)}>Cancel</button>
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