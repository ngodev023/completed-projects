// This class can be used to create an instance housing various methods of calling fetch to localhost:5000/api, where a restful api should be running to serve data

export default class Data {
  // method for sending requests to REST api
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    
    const url = 'http://localhost:5000/api' + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if(requiresAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // method for getting user info from REST api... primarily used to authenticate user.
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, {emailAddress, password});
    return response;
  }
  
  // method that assists the sign up page by logging data into REST api's database.
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    return response;
  }

  // Method gets courses from db, doesn't require auth, but will redirect to error page if it doesn't get a 200 status code in response
  // props argument allows for redirecting.
  async getCourses(props) {
    const results = await this.api('/courses');
    if( results.status !== 200) {
      props.history.push('/error');
    } else {
      return results.json();
    }
  }

  // gets one course from db based on argument, the course's id
  // will only respond with course or null; component will handle from there...
  async getOneCourse (courseId, history) {
    const result = await this.api('/courses/'+courseId);
    if(result.status === 200) {
      return result.json();
    } else if (result.status === 500) {
      // if api isn't working propertly, redirect user to error page
      history.push('/error')
    }
  }

  // Creates a new course; will return a status code and the location uri, which can be used to redirect user to the newly created course.
  async createCourse (reqBody, emailAddress, password) {
    const post = await this.api('/courses/', 'POST', reqBody, true, {emailAddress, password});
    return post;
  }

  // updates a course via PUT route on api side
  async updateCourse (courseId, reqBody, emailAddress, password){
    const response = await this.api('/courses/'+courseId, 'PUT', reqBody, true, {emailAddress, password});
    return response;
  }

  // deletes course; requires auth; will prompt user to confirm choice before carrying out destroy method.
  async deleteCourse (courseId, emailAddress, password) {
    const response = await this.api('/courses/'+courseId, 'DELETE', null, true, {emailAddress, password});
    if (response.status === 204) {
      return "Course Deleted"
    } else if (response.status === 500) {
      return "ERROR"
    } else {
      return "ERROR"
    }
  }
}
  
  