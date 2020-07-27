import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, Input, Button, TextArea, Segment, Grid, Checkbox, Card } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import ImageUploader from 'react-images-upload';
import { generateHash } from '../../../utils/Encryption';
import { initiateCollection, 
        createRecord, 
        initiateAppCollection, 
        createAppRecord, 
        hasRecord, 
        updateRecord, 
        hasAppRecord, 
        updateAppRecord,
        retrieveAppRecord,
        retrieveRecord } from '../../../utils/ThreadDB';
import ReactQuill from 'react-quill';

import './profile.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';

import { profileSchema } from '../../../schemas/Profile';

class EditProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            member: '',
            profileId: '',
            firstName: '',
            lastName: '',
            avatar: [],
            avatarHash: '',
            profilePrivacy: true,
            profileVerificationHash: '',
            loaded: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDropAvatar = this.onDropAvatar.bind(this);
    }


    componentDidMount() {
        this.loadData().then((result) => {
            let memberAccount = this.props.history.location.pathname.slice(14)
            let profileId = this.props.history.location.hash.slice(1)
            this.setState({
                loaded:true,
                member: memberAccount,
                profileId: profileId
            })
            console.log('edit profile id', this.state.profileId)
            console.log('member', this.state.member)
            if(result) {
                this.setState({
                    profileId: result._id,
                    member: result.member,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    avatar: result.avatar,
                    profilePrivacy: result.privacy,
                })
            } 
        })
    }

    async loadData() {
        let profileId = this.props.history.location.hash.slice(1)
        let record = await retrieveAppRecord(profileId, 'Profile')
        if(!record) {
            record = await retrieveRecord(profileId, 'Profile')
        }
        console.log('profile record', record)
        if(record !== undefined) {
            return record
        } else {
            console.log('no profile record')
        }    
    }


   async onDropAvatar(pictureFiles, pictureDataURLs) {
        this.setState({
               avatar: pictureDataURLs[0]
           })
    }


    handleFirstNameChange = (event) => {
        let value = event.target.value;
        this.setState({ 
            firstName: value
        })
        this.props.handleChange({ name: "firstName", value })
    }


    handleLastNameChange = (event) => {
        let value = event.target.value;
        this.setState({ 
            lastName: value
        })
        this.props.handleChange({ name: "lastName", value })
    }


    handlePrivacyToggle = () => {
        const privacy = !(this.state.profilePrivacy)
        this.setState({
            profilePrivacy: privacy
        })
        this.props.handleChange( {name: "profilePrivacy", privacy })
    }

    async generateVerificationHash() {
        let data = (this.state.profileId).concat(
            ',',this.state.member,
            ',',this.state.firstName,
            ',',this.state.lastName
        )
        console.log(data)
        let profileVerificationHash = await generateHash(data);
        this.setState({
            profileVerificationHash: profileVerificationHash.toString()
        })
        console.log('profileVerification hash ', this.state.profileVerificationHash)
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.generateVerificationHash();
       
        let record = {
            _id: this.state.profileId,
            member: this.state.member,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            avatar: this.state.avatar,
            verificationHash: this.state.profileVerificationHash,
            privacy: this.state.profilePrivacy
        }

        let presentInUserDatabase = await hasRecord('Profile', this.state.profileId)
        if(presentInUserDatabase) {
            console.log('presentinuserdatabase', presentInUserDatabase)
            console.log('record here', record)
            await updateRecord('Profile', record)
        } else {
            await initiateCollection('Profile', profileSchema)
            console.log('record here too', record)
            await createRecord('Profile', record);
        }
                
        if(this.state.profilePrivacy) {
            let presentInAppDatabase = await hasAppRecord('Profile', this.state.profileId)
            if(presentInAppDatabase) {
                console.log('record here', record)
                await updateAppRecord('Profile', record)
            } else {
                await initiateAppCollection('Profile', profileSchema)
                console.log('record here too', record)
                await createAppRecord('Profile', record);
            }
        }

        this.props.handleChange({ name: 'profileId', value: this.state.profileId})
        this.props.handleChange({ name: 'profileVerificationHash', value: this.state.profileVerificationHash})
        this.props.handleChange({ name: 'profilePrivacy', value: this.state.profilePrivacy})
        this.props.history.push("/profiling")
    }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote', 'code', 'code-block'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, {'align': []}],
          ['link', 'image', 'video'],
          ['clean']
        ],
      };
    
      formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote', 'code', 'code-block',
        'list', 'bullet', 'indent','align',
        'link', 'image', 'video'
      ];

    render() {
        
        if (this.state.loaded === false) {
            return <div>Loading...</div>
        } else {
    
        return (
                <Container className="main">
                <Form onSubmit={this.handleSubmit}>
                    <Segment>
                        <label>Private</label>
                        <Checkbox toggle 
                            onChange={this.handlePrivacyToggle}
                        />
                    </Segment>
                   <Segment>
                            <ImageUploader
                                withIcon={true}
                                buttonText="Choose Profile Pic"
                                onChange={this.onDropAvatar}
                                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                                maxFileSize={5242880}
                                withPreview={true}
                            />
                     </Segment>
                    <Segment.Group horizontal>
                        <Segment.Inline>
                            <Form.Field
                                label="First Name"
                                control={Input}
                                name="firstName"
                                type="text"
                                placeholder={this.state.firstName?this.state.firstName:'First Name'}
                                onChange={this.handleFirstNameChange}
                                value={this.state.firstName}
                                required
                            />
                        </Segment.Inline>
                        <Segment.Inline>
                            <Form.Field
                            label="Last Name"
                            control={Input}
                            name="lastName"
                            type="text"
                            placeholder={this.state.lastName?this.state.firstName:'Last Name'}
                            onChange={this.handleLastNameChange}
                            value={this.state.lastName}
                            required
                        />
                        </Segment.Inline>
                    </Segment.Group>
                    <Segment basic>   
                            <Form.Button
                                className="submitButton"
                                content='Save Profile'
                            />
                    </Segment>     
                </Form>
                </Container>
        )
    }
    }
}

export default withRouter(EditProfile)