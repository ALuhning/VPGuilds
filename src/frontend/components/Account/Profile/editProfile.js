import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, Input, Button, TextArea, Segment, Grid, Checkbox, Card } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import ImageUploader from 'react-images-upload';
import { generateHash } from '../../../utils/Encryption';
import { initiateCollection, createRecord, initiateAppCollection, createAppRecord } from '../../../utils/ThreadDB';
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
        this.loadData().then(() => {
            this.setState({loaded:true})
        })
    }


    async loadData() {
        this.setState({
            member: this.props.accountId,
            profileId: this.props.history.location.pathname.slice(8)
        })
    }


   async onDropAvatar(pictureFiles, pictureDataURLs) {
        this.setState({
               avatar: (this.state.avatar).concat(pictureDataURLs)
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
        await initiateCollection('Profile', profileSchema)
        await createRecord('Profile', [
                  {
                    _id: this.state.profileId,
                    member: this.state.member,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    avatar: this.state.avatar,
                    verificationHash: this.state.profileVerificationHash,
                    privacy: this.state.profilePrivacy
                  }
            ]);
        if(this.state.profilePrivacy) {
            await initiateAppCollection('Profile', profileSchema)
            await createAppRecord('Profile', [
                {
                    _id: this.state.profileId,
                    member: this.state.member,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    avatar: this.state.avatar,
                    verificationHash: this.state.profileVerificationHash,
                    privacy: this.state.profilePrivacy
                }
            ]);
        }
            this.props.handleChange({ name: 'profileId', value: this.state.commentId})
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
                                placeholder="First Name"
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
                            placeholder="Last Name"
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
        )
    }
    }
}

export default withRouter(EditProfile)