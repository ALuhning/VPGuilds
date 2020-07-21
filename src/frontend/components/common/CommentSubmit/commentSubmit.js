import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, Input, Button, TextArea, Segment, Grid, Checkbox } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import ImageUploader from 'react-images-upload';
import { generateHash } from '../../../utils/Encryption';
import { initiateCollection, createRecord, initiateAppCollection, createAppRecord } from '../../../utils/ThreadDB';
import ReactQuill from 'react-quill';

import './commentSubmit.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';

import { commentSchema } from '../../../schemas/Comment';

class CommentSubmitForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentParent: '',
            commentSubject: '',
            commentDate: new Date().getTime(),
            commentAuthor: '',
            commentBody: '',
            commentPhotos: [],
            commentVerificationHash: '',
            commentPublished: false,
            loaded: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.loadData().then(() => {
            this.setState({loaded:true})
        })
    }


    async loadData() {
        this.setState({
            commentAuthor: this.props.accountId,
            commentParent: this.props.history.location.pathname.slice(2)
        })
    }


   async onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
               commentPhotos: (this.state.commentPhotos).concat(pictureDataURLs)
           })
    }

    handleDateChange = (event) => {
        console.log('event', event)
        this.setState({ 
            commentDate: event
        })
        this.props.handleDateChange({ name: "commentDate", value: event });
    }


    handleSubjectChange = (event) => {
        let value = event.target.value;
        this.setState({ 
            commentSubject: value
        })
        this.props.handleChange({ name: "commentSubject", value })
    }

    handlePublishToggle = () => {
        const published = !(this.state.commentPublished)
        this.setState({
            commentPublished: published
        })
        this.props.handleChange( {name: "commentPublished", published })
    }


    handleBodyChange = (event) => {
        this.setState({ 
            commentBody: event
        })
        this.props.handleChange({ name: "commentBody", event })
    }

    async generateId() {
        let buf = Math.random([0, 999999999]);
        let b64 = btoa(buf);
        this.setState({
            commentId: b64.toString()
        })
        console.log('commentId :', this.state.commentId)
    }

    async generateVerificationHash() {
        let data = (this.state.commentId).concat(
            ',',this.state.commentAuthor,
            ',',this.state.commentDate,
            ',',this.state.commentParent,
            ',',this.state.commentBody,
            ',',this.state.commentPhotos,
            ',',this.state.commentSubject,
            ',',this.state.commentPublished
        )
        console.log(data)
        let commentVerificationHash = await generateHash(data);
        this.setState({
            commentVerificationHash: commentVerificationHash.toString()
        })
        console.log('commentVerification hash ', this.state.commentVerificationHash)
    }

    async handleSubmit(e) {
        e.preventDefault();
       await this.generateId();
       await this.generateVerificationHash();
       await initiateCollection('Comment', commentSchema)
       await createRecord('Comment', [
                  {
                    _id: this.state.commentId,
                    parent: this.state.commentParent,
                    subject: this.state.commentSubject,
                    body: this.state.commentBody,
                    verificationHash: this.state.commentVerificationHash,
                    author: this.state.commentAuthor,
                    postDate: this.state.commentDate,
                    published: this.state.commentPublished
                  }
            ]);
        if(this.state.commentPublished) {
            await initiateAppCollection('Comment', commentSchema)
            await createAppRecord('Comment', [
                {
                    _id: this.state.commentId,
                    parent: this.state.commentParent,
                    subject: this.state.commentSubject,
                    body: this.state.commentBody,
                    verificationHash: this.state.commentVerificationHash,
                    author: this.state.commentAuthor,
                    postDate: this.state.commentDate,
                    published: this.state.commentPublished
                }
            ]);
        }
            this.props.handleChange({ name: 'commentId', value: this.state.commentId})
            this.props.handleChange({ name: 'commentParent', value: this.state.commentParent})
            this.props.handleChange({ name: 'commentVerificationHash', value: this.state.commentVerificationHash})
            this.props.handleChange({ name: 'commentPublished', value: this.state.commentPublished})
            this.props.history.push("/commenting")
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
                    <Segment.Group horizontal>
                        <Segment>
                            <Form.Field
                                label="Comment Subject"
                                control={Input}
                                name="commentSubject"
                                type="text"
                                placeholder="Subject"
                                onChange={this.handleSubjectChange}
                                value={this.state.commentSubject}
                                required
                        />
                        </Segment>
                        <Segment.Group>
                            <DatePicker
                                className="datepicker"
                                selected={this.state.commentDate}
                                onChange={this.handleDateChange}
                                name="commentDate"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                required
                                hidden
                            />
                            <Segment.Inline>
                                <label>Published</label>
                                <Checkbox toggle 
                                    onChange={this.handlePublishToggle}
                                />
                            </Segment.Inline>
                        </Segment.Group>
                     </Segment.Group>
                            <ReactQuill
                                theme="snow"
                                modules={this.modules}
                                formats={this.formats}
                                onChange={this.handleBodyChange}
                                value={this.state.commentBody}
                                style={{height:'200px'}}
                                required
                            />
                    <Segment basic>   
                            <Form.Button
                                className="submitButton"
                                content='Submit'
                            />
                    </Segment>     
                </Form>
        )
    }
    }
}

export default withRouter(CommentSubmitForm)