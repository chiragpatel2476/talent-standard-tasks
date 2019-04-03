import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import TalentDetail from '../TalentFeed/TalentDetail.jsx';
// Main component : Renders 'Company Profile', 'Talent Card' and 'FollowingSuggestion' component...
export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData: loaderData });//comment this
    }

    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
        this.init()
    };

   
    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="four wide column">
                                <CompanyProfile />
                            </div>
                            <div className="eight wide column">
                                <TalentDetail />
                            </div>
                            <div className="four wide column">
                                <FollowingSuggestion />
                            </div>
                        </div>
                    </div>
                </section>
            </BodyWrapper>     
        )
    }
}