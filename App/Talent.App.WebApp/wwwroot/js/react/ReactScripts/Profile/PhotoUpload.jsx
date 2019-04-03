/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: [],
            selectedFileName: [],
            imageSrc: [],
            imageId: [],
            selectedRemoveFileId: [],
            currentNoOfFiles: 0,
            newImageSelected: false
        }

        this.maxFileSize = 2097152;
        this.maxNoOfFiles = 1;
        this.acceptedFileType = ["image/gif", "image/jpeg", "image/png", "image/jpg"];


        this.renderDisplayCameraIcon = this.renderDisplayCameraIcon.bind(this);
        this.renderDisplayProfileImage = this.renderDisplayProfileImage.bind(this);
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.loadImages = this.loadImages.bind(this);
        this.fileUploadHandler = this.fileUploadHandler.bind(this);
        this.selectFileToUpload = this.selectFileToUpload.bind(this);
        this.setImageSRC = this.setImageSRC.bind(this);
    };
    // Maps the 'click' event to the input type="file" control through DOM
    selectFileToUpload() {
        document.getElementById('selectFile').click();
    }

    loadImages(Id) {

        var cookies = Cookies.get('talentAuthToken');
        // Retrieve all the profile images for an employer by using it's 'Id'
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfileImage/?id=' + Id,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {

                let imageSrcArr = [];
                let imageIdArr = [];
                let selectedFileArr = [];
                // Retrieves all the 'physical' files of the specified 'Id' by using filenames retrieved from data
                // loads the physical files and their 'id' into the array, 
                if (res.employerProfile.length > 0) {
                    for (var i = 0; i < res.employerProfile.length; i++) {
                        imageSrcArr.push("http://localhost:60290/profile/profile/getEmployerProfileImages/?Id=" + res.employerProfile[i].fileName);
                        imageIdArr.push(res.employerProfile[i].id);
                        selectedFileArr.push("");
                    }
                }
                // Sets the variables with the retrieved values
                this.setState({
                    imageSrc: imageSrcArr,
                    imageId: imageIdArr,
                    selectedFile: selectedFileArr,
                    selectedFileName: [],
                    selectedRemoveFileId: [],
                    currentNoOfFiles: res.employerProfile.length
                });
            }.bind(this)
        });
    }

    componentDidMount() {
        
    }

    setImageSRC() {
        let imgPath = [];
        imgPath[0] = this.props.imageUrl;
        this.setState({
            imageSrc: imgPath
        }, () => { console.log("Image profile photo path has been set...")})
    }

    // Generates individual arrays of physical file(s) (itself), their local names, generates their local src and local id 
    // selected by type='file' control from local computer, checks their validations and assigns them to 'state' variables
    fileSelectedHandler(event) {
       // console.log("fileSelectedHandler function called..");
        let localSelectedFile = this.state.selectedFile;
        let localSelectedFileName = this.state.selectedFileName;
        let localImageSrc = this.state.imageSrc;
        let localImageId = this.state.imageId;
        let localCurrentNoOfFiles = this.state.currentNoOfFiles;

        for (let i = 0; i < event.target.files.length; i++) {

            if (event.target.files[i].size > this.maxFileSize || this.acceptedFileType.indexOf(event.target.files[i].type) == -1) {
                TalentUtil.notification.show("Max file size is 2 MB and supported file types are *.jpg, *.jpeg, *.png, *.gif", "error", null, null);
            } else if (localCurrentNoOfFiles >= this.maxNoOfFiles) {
                TalentUtil.notification.show("Exceed Maximum number of files allowable to upload", "error", null, null);
            } else {
                localSelectedFile = localSelectedFile.concat(event.target.files[i]);
                localSelectedFileName = localSelectedFileName.concat(event.target.files[i].name);
                localImageSrc = localImageSrc.concat(window.URL.createObjectURL(event.target.files[i]));
                localImageId = localImageId.concat('0');
                localCurrentNoOfFiles = localCurrentNoOfFiles + 1;
            }
        }

        this.setState({
            selectedFile: localSelectedFile,
            selectedFileName: localSelectedFileName,
            imageSrc: localImageSrc,
            imageId: localImageId,
            currentNoOfFiles: localCurrentNoOfFiles,
            newImageSelected: true
        })
    }

    // sends the local selected files to the 'controller'
    fileUploadHandler(Id) {
    //    console.log("fileUploadHandler function called...");
        let data = new FormData();
        for (var i = 0; i < this.state.selectedFile.length; i++) {
            if (this.state.selectedFile[i] != "") {
                data.append('file' + i, this.state.selectedFile[i]);
            }
        }

        data.append('Id', Id);
        data.append('FileRemoveId', this.state.selectedRemoveFileId);

        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: this.props.savePhotoUrl,
            headers: {
                'Authorization': 'Bearer ' + cookies
            },
            type: "POST",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.success) {
                  //  this.loadImages(Id);
                    TalentUtil.notification.show("Image uploaded sucessfully", "success", null, null)
                    this.setState({
                        newImageSelected: false
                    })
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }.bind(this),
            error: function (res, status, error) {
                //Display error
                TalentUtil.notification.show("There is an error when updating Images - " + error, "error", null, null);
            }
        });
    }

    render() {

        // This component should upload the profileImage by itself but the newImageFileName & newImageFileURL values have to be
        // retrieved from database some how...Those two values are generated by imageUpload function itself and NOT by 'AccountProfile' component
        // props.imageUrl={this.state.profileData.profilePhotoUrl} == is being automatically generated at the time of image add or image update time
        // only image name ('imgName') is to be supplied to the 'AccountProfile' component at the time of image upload or edit
        // 'savePhotoUrl' to be used from this component...
       
        //if (this.props.imageUrl) {
        //    this.setImageSRC();
        //}

        console.log("this.props.imageUrl: " + this.props.imageUrl);

        return (

           
           this.props.imageUrl ? this.renderDisplayProfileImage() : this.renderDisplayCameraIcon()
           //this.state.imageSrc[0] ? this.renderDisplayProfileImage() : this.renderDisplayCameraIcon()
        );
        
    }

    renderDisplayProfileImage() {
        let imageUploaderButton = (this.state.newImageSelected) ? (<button type="button" className="ui teal button" onClick={this.fileUploadHandler.bind(this)}><i class="upload icon"></i> Upload</button>) : '';
        let profileImageURL = this.state.imageSrc[0] ? this.state.imageSrc[0] : this.props.imageUrl;
        //console.log("window.URL.createObjectURL(this.props.imageUrl: " + window.URL.createObjectURL(this.props.imageUrl));
        console.log("profileImageURL: " + profileImageURL);

        return (
            <React.Fragment>
                
                <img style={{ height: 112, width: 112, borderRadius: 55 }} className="ui small" src={profileImageURL} onClick={this.selectFileToUpload} alt="Image Not Found" />
                <div style={{ width: 112}}>
                    {imageUploaderButton}
                </div>
                <input id="selectFile" type="file" style={{ display: 'none' }} onChange={this.fileSelectedHandler} accept="image/*" />
            </React.Fragment>
        );
    }

    renderDisplayCameraIcon() {
        return (
            <span>
                <i className="huge circular camera retro icon" style={{ height: 112, width: 112, borderRadius: 55, alignContent: 'right', verticalAlign: 'top' }} onClick={this.selectFileToUpload}></i>
                <input id="selectFile" type="file" style={{ display: 'none' }} onChange={this.fileSelectedHandler} accept="image/*" />
            </span>
        );
    }
}
