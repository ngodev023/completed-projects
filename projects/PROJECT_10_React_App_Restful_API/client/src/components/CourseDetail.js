import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkDown from 'react-markdown';

export default class CourseDetail extends Component {
    // initiate class with the following state properties; will assume at first that the user is not owner of course.
    state = {
        courseTitle: '',
        courseId: '',
        courseDesc: '',
        courseTime: '',
        courseMaterials: '',
        ownerFN: '',
        ownerLN: '',
        ownerEmail: '',
        ownerId: '',
        ownerPresent: false
    }

    // upon loading, component will reach out to api, using the provided id query to find a course
    async componentDidMount(){
        // user's authentication data is acquired here... and will be used to determine if user is owner of course.
        const userAuth = this.props.context.authenticatedUser;

        // store the id of the course user wants to retrieve in a variable
        const courseId = this.props.match.params.id;

        // asyncronously reach out to api for the specified course
        const gottenCourse = await this.props.context.data.getOneCourse(courseId, this.props.history);
        
        // upon receiving data from api about course, program will update the state properties.
        // ownerPresent will evaluate to true if userAuth data matches up with the returned data from api
        if (gottenCourse) {
                this.setState({
                    courseTitle: gottenCourse.title,
                    courseId: gottenCourse.id,
                    courseDesc: gottenCourse.description,
                    courseTime: gottenCourse.estimatedTime,
                    courseMaterials: gottenCourse.materialsNeeded,
                    ownerFN: gottenCourse.user.firstName,
                    ownerLN: gottenCourse.user.lastName,
                    ownerEmail: gottenCourse.user.emailAddress,
                    ownerId: gottenCourse.user.id,

                    // user's current data being compared with queried course data about owner's email address
                    ownerPresent: userAuth ? userAuth.emailAddress === gottenCourse.user.emailAddress : false
                })
            } else {
                // browser will redirect if api/gottenCourse returns null for a response
                this.props.history.push('/notfound');
            }
    }

    // handles deletion of current course; will ask for confirmation before carrying out deletion
   destroy () {
        let confirm = window.confirm("This action cannot be undone...")
        if (confirm) {
            const {context} = this.props;
            context.data.deleteCourse(this.state.courseId, context.authenticatedUser.emailAddress, context.authenticatedPassword)
                .then(result => {
                    if (result === "Course Deleted"){
                        this.props.history.push('/');
                    } else if (result === "ERROR") {
                        this.props.history.push('/error');
                    }
                })
            
        }
   }


    render () {
        // destructure state's properties for ease of use
        const {
            courseTitle, 
            courseId,
            courseDesc,
            courseTime,
            courseMaterials, 
            ownerFN, 
            ownerLN, 
            ownerPresent} = this.state;
        
            // this variable will evaluate to either true or false--allowing component to render the edit and delete buttons if owner is present
            const updateGate = ownerPresent ? `/courses/${courseId}/update` : '/forbidden'; 
            
        return (
            // unfortunately, Form component doesn't render as expected with provided CSS info... will have to build a unique form from scratch
            <main>
                <div className="actions--bar">
                    <div className="wrap">
                        {ownerPresent? <Link className="button" to={updateGate}>Update Course</Link> : ""}
                        {ownerPresent? <button className="button" onClick={this.destroy.bind(this)}>Delete Course</button> : ""}
                        <Link className="button button-secondary" to={'/'}>Return to List</Link>
                    </div>
                </div>
                <div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">Course</h3>
                                <h4 className="course--name">{courseTitle}</h4>
                                <p>By {`${ownerFN} ${ownerLN}`}</p>
                                <ReactMarkDown>{courseDesc}</ReactMarkDown>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                <p>{courseTime}</p>
                                <h3 className="course--detail--title">Materials Needed</h3>
                                <ReactMarkDown>{courseMaterials}</ReactMarkDown>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        )
    }

}