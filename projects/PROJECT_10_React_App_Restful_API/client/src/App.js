// import tools, mainly router mechanisms
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// import private routes

import PrivateRoute from './PrivateRoute';

// import sign in/out/up components
import Header from './components/Header';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';



// import course components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

// import Consumer wrapper component
import withContext from './Context';

// subscribe all components to Context Provider using withContext

const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);

// app component will render the majority of what user sees.
// Header will appear on each page, minus error pages and forbidden page
const App = () => (
  <Router>
    <div>
      <HeaderWithContext />
      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        
        <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />

        <PrivateRoute exact path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path="/error" component={UnhandledError} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);
export default App;