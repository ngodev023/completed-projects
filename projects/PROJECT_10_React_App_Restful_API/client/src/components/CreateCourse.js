import React, { Component } from 'react';

// this component will render an input form for creating a new course
export default class CreateCourse extends Component {
    // initiate instance with the following properties, inlcuding error array to store any unexpected error
    state = {
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
        errors: []
    }

    render() {
        // destructure state's props for ease of use
        const {
            title, 
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        const {context} = this.props;
        return (
            <main>
                <div className="wrap">
                    <h2>Create Course</h2>
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
                        <button className="button" type="submit">Create Course</button>
                        <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                    </form>
                </div>
            </main>
        )
    }

    // this method keeps track of user's inputs and updating it in the state prop in real time; wired to elements' onChange props
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
    }

    // clicking submit/create course button
    submit = async (event) => {
        // prevent page from reloading; the default effect
        event.preventDefault();

        // store the methods passed down in props from the Provider in its own variable for ease of use
        const {context} = this.props;
        
        // Destructure the state's properties... essentially the user inputs as he/she types.
        const {title, description, estimatedTime, materialsNeeded} = this.state;
        
        // store the necessary info minus error array into a reqBody for making a fetch request via context.data... for when user hits submit/save
        const reqBody = {title, description, estimatedTime, materialsNeeded};

        // send a request to the post route using the reqBody and the authorization info. 
        try{
            // use data's api method to send a request to db
            // don't forget to include cookies' email and password; as the route requires authentication
            const response = await context.data.createCourse(reqBody, context.authenticatedUser.emailAddress, context.authenticatedPassword);
                if (response.status === 201) {
                    // course successfully created
                    // browser will redirect to the newly created coure's CourseDetail Page, using location information in the response header 
                    this.props.history.push(response.headers.get('Location'));
                } else if (response.status === 400) {
                    // 400 will prompt program to update state's errors property with an array of errors sent back from api
                    const errors = await response.json();
                    this.setState({
                        errors: errors.errors
                    })
                } else if (response.status === 500){
                    // 500 means the db is not working properly
                    // redirect user to a generic errors page
                    this.props.history.push('/error');
                }
            } catch (error) {
                // cannot send request for whatever reason
                // No connection? Data server not running?
                this.props.history.push('/error');
            }
            
    }

    // cancel button; returns user to course listing
    cancel = (event) => {
        event.preventDefault();
        this.props.history.push('/');
    }
}