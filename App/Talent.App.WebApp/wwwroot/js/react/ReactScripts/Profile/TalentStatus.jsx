import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newJobSeekingStatus: {
                status: "",
                availableDate: null
            },

            jobSeekingStatusOptions: {
                'Actively looking for a job': 'Actively looking for a job',
                'Not looking for a job at the moment':  'Not looking for a job at the moment',
                'Currently employed but open to offers': 'Currently employed but open to offers',
                'Will be available on later date': 'Will be available on later date' 
            }
        }

        this.handleJobSeekingChange = this.handleJobSeekingChange.bind(this);
        this.saveJobSeekingData = this.saveJobSeekingData.bind(this);
        this.renderRadioWithLabel = this.renderRadioWithLabel.bind(this);
    }


    handleJobSeekingChange(event) {

        let name = event.target.name;
        let value = event.target.value;

        let data = Object.assign({}, this.state.newJobSeekingStatus);

        data[name] = value;

        this.setState({
            newJobSeekingDetails: data
        }, () => { this.saveJobSeekingData() });
    }

    saveJobSeekingData() {
        let data = {};
        data.jobSeekingStatus = this.state.newJobSeekingDetails;
        this.props.controlFunc(this.props.componentId, data)
        return true;
    }

    render() {

        let jobSeekingOptions = [];
        let jobSeekingStatusOptions = this.state.jobSeekingStatusOptions ? this.state.jobSeekingStatusOptions : '';

        return (
            <React.Fragment>
                <div>
                    { Object.keys(jobSeekingStatusOptions).map((key) => {
                        return this.renderRadioWithLabel(key);
                    }, this)}

                </div>
            </React.Fragment>
        );

    }

    renderRadioWithLabel(key) {

        let selectedOption = this.state.newJobSeekingStatus.status ? this.state.newJobSeekingStatus.status : this.props.status.status;
        var isChecked = key === selectedOption;
        
        return (
            <div key={key}>
                <label key={key} htmlFor={key}>
                    <input type="radio" key={key} name="status" checked={isChecked} value={key} onChange={this.handleJobSeekingChange.bind(this)}/>
                    {this.state.jobSeekingStatusOptions[key]}
                </label>
                <br />
            </div>
        );
    }

}