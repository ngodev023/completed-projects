import React, { Component } from 'react';

// this component will render the update a course page... very tricky, lots of moving parts.
export default class UpdateCourse extends Component {
    // initiate instance with the following properties, inlcuding error array to store any unexpected error
    state = {
        courseId: '',
        title:'',
        description:'',
        estimatedTime:'',
        materialsNeeded:'',
        ownerId:'',
        errors:[]
    }

    // when component mounts, assuming user is honestly trying to update his own course/ not trying to fiddle with url... or hacking...
    // First, reach out to api to retrieve the course info that user wants to update.
    async componentDidMount () {
        try {
        // store context into its own variable for ease of use
        const {context} = this.props;
        
        // Reach out to api to get the course specified in the url query--should be the id parameter
        // This response should return the OUTDATED info
        const response = await context.data.getOneCourse(this.props.match.params.id);

        // User needs to know what he/she's updating, so update the state's props to reflect the outdated info
        this.setState({
            courseId: response.id,
            title: response.title,
            description: response.description,
            estimatedTime: response.estimatedTime,
            materialsNeeded: response.materialsNeeded,
            ownerId: response.userId

        });
        
        // if it turns out user isn't owner... and has no business being on this page... redirect to forbidden page
           if(context.authenticatedUser.id !== this.state.ownerId) {
            this.props.history.push('/forbidden');
            } 
        } catch (error) {
            // if the course doesn't even exist, or has been deleted probably... redirect to not found
            this.props.history.push('/notfound');
        }
    }

    // keeps track of input changes and updates them in state's properties in real time
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }

    // Once User is done making changes, hitting the submit/save button should initiate the following protocols.
      submit = async (event) => {
        // stop form from refreshing page
        event.preventDefault();

        // stuff passed down from the Provider component, such as the ability to make requests to the api server
        const {context} = this.props;

        // stuff currently in the state property... essentially the user inputs/changes made
        const {courseId, title, description, estimatedTime, materialsNeeded} = this.state;
        
        // store the necessary info minus error array into a reqBody
        const reqBody = {title, description, estimatedTime, materialsNeeded};

        // send a request to the PUT route using the reqBody, and the authorization info.
        // response variable will hold an asynchronous response... let's check that response in the if statement below
        const response = await context.data.updateCourse(courseId, reqBody, context.authenticatedUser.emailAddress, context.authenticatedPassword)

            if (response.status === 204) {
                // if udate is successful, redirect to that course's new Course Details page
                this.props.history.push(`/courses/${courseId}`);
            } else if (response.status === 400) {
                // if it's a 400 error, then something didn't meet the fields' requirements.
                // simply update the errors array so component can render them and make them visible to user
                const errors = await response.json();
                this.setState({
                    errors: errors.errors
                })
            } else if (response.status === 403) {
                // it's unlikely a user would have gotten this far, but on the off chance the supplied authorization info doesn't match up with course owner's...
                this.props.history.push('/forbidden');
            } else if (response.status === 500) {
                this.props.history.push('/error');
            }else {
                // if server is down on whichever side, redirect user to an error's page.
                this.props.history.push('/error');
            }
        
      }

    // sends user back to course listing page
    cancel = (event) => {
        event.preventDefault();
        this.props.history.push(`/courses/${this.state.courseId}`);
      }

    // finally, let's render
    render() {
        // destrucure the state's properties for ease of use
        const {
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        // put context(for getting cookies' user firstname and lastname) in its own variable for ease of use
        const {context} = this.props;
        
        // unfortunately, Form component doesn't render as expectedly to meet desired visual, will have to build a form from scratch
        // Form will check for errors if there are any, and display them--will display an empty div is there are none.
        // Form prepopulates all input fields with the outdated data that currently exists in the database via the value attributes on each input element
        return(
            <main>
                <div className="wrap">
                    <h2>Update Course</h2>
                    {errors.length > 0 ? (
                        <div className="validation--errors">
                            <h3>Validation Errors</h3>
                            <ul>{errors.map((error, i) => <li key={i}>{error}</li>)}</ul>
                        </div>
                    )
                    :
                    (
                        <div></div>
                    )}
                    <form onSubmit={this.submit}>
                        <div className="main--flex">
                            <div>
                                <label htmlFor="title">Course Title</label>
                                <input id="title" name="title" type="text" value={title} onChange={this.change}/>

                                <p>By {`${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`}</p>

                                <label htmlFor="description">Course Description</label>
                                <textarea id="description" name="description" value={description} onChange={this.change} />
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input id="estimatedTime" name="estimatedTime" type="text" value={estimatedTime} onChange={this.change} />

                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea id="materialsNeeded" name="materialsNeeded" value={materialsNeeded} onChange={this.change} />
                            </div>
                        </div>
                        <button className="button" type="submit">Update Course</button>
                        <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                    </form>
                </div>
            </main>
        )
    }
}