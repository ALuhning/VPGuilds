import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, Input, Button, TextArea, Segment, Grid, Checkbox } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import ImageUploader from 'react-images-upload';
import { generateHash } from '../../../utils/Encryption';
import { initiateCollection, retrieveRecord, createRecord, initiateAppCollection, createAppRecord } from '../../../utils/ThreadDB';
import ReactQuill from 'react-quill';

import './newsSubmitForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';

import { newsPostSchema } from '../../../schemas/NewsPost';

class NewsSubmitForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newsPostId: '',
            newsPostTitle: '',
            newsPostDate: new Date().getTime(),
            newsPostAuthor: '',
            newsPostBody: '',
            newsPostCategory: '',
            newsPostPhotos: [],
            newsVerificationHash: '',
            published: false,
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
        this.setState({newsPostAuthor: this.props.accountId})
    }


   async onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
               newsPostPhotos: (this.state.newsPostPhotos).concat(pictureDataURLs)
           })
    }

    handleDateChange = (event) => {
        console.log('event', event)
        this.setState({ 
            newsPostDate: event
        })
        console.log('nespostdatebefore', this.state.newsPostDate)
        this.props.handleDateChange({ name: "newsPostDate", value: event });
        console.log('newspostdate', this.state.newsPostDate)
    }


    handleTitleChange = (event) => {
        let value = event.target.value;
        this.setState({ 
            newsPostTitle: value
        })
        this.props.handleChange({ name: "newsPostTitle", value })
    }

    handlePublishToggle = () => {
        const published = !(this.state.published)
        this.setState({
            published: published
        })
        this.props.handleChange( {name: "published", published })
    }


    handleBodyChange = (event) => {
        this.setState({ 
            newsPostBody: event
        })
        this.props.handleChange({ name: "newsPostBody", event })
    }

    async generateId() {
        let buf = Math.random([0, 999999999]);
        let b64 = btoa(buf);
        this.setState({
            newsPostId: b64.toString()
        })
        console.log('newsPostId :', this.state.newsPostId)
    }

    async generateVerificationHash() {
        let data = (this.state.newsPostId).concat(
            ',',this.state.newsPostAuthor,
            ',',this.state.newsPostDate,
            ',',this.state.newsPostCategory,
            ',',this.state.newsPostBody,
            ',',this.state.newsPostPhotos,
            ',',this.state.newsPostTitle,
        )
        console.log(data)
        let verificationHash = await generateHash(data);
        this.setState({
            newsVerificationHash: verificationHash.toString()
        })
        console.log('newsVerification hash ', this.state.newsVerificationHash)
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.generateId();
        await this.generateVerificationHash();

        let record = {
            _id: this.state.newsPostId,
            title: this.state.newsPostTitle,
            body: this.state.newsPostBody,
            category: this.state.newsPostCategory,
            verificationHash: this.state.newsVerificationHash,
            author: this.state.newsPostAuthor,
            newsPostPhotos: this.state.newsPostPhotos,
            postDate: new Date(this.state.newsPostDate).getTime(),
            published: this.state.published
        }
       console.log('date to store', new Date(this.state.newsPostDate).getTime())
       await initiateCollection('NewsPost', newsPostSchema)
       await createRecord('NewsPost', record)
        if(this.state.published) {
            await initiateAppCollection('NewsPost', newsPostSchema)
            await createAppRecord('NewsPost', record)
        }
            this.props.handleChange({ name: 'newsPostId', value: this.state.newsPostId})
            this.props.handleChange({ name: 'newsVerificationHash', value: this.state.newsVerificationHash})
            this.props.handleChange({ name: 'published', value: this.state.published})
            this.props.history.push("/posting")
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
                                label="Post Title"
                                control={Input}
                                name="NewsPostTitle"
                                type="text"
                                placeholder="Title"
                                onChange={this.handleTitleChange}
                                value={this.state.newsPostTitle}
                                required
                        />
                        </Segment>
                        <Segment.Group>
                            <DatePicker
                                className="datepicker"
                                selected={this.state.newsPostDate}
                                onChange={this.handleDateChange}
                                name="NewsPostDate"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                required
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
                                value={this.state.newsPostBody}
                                style={{height:'400px'}}
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

export default withRouter(NewsSubmitForm)