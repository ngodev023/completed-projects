import React from 'react';

// this component renders a Form element 
const Form = (props) => {
  const {cancel,errors,submit,submitButtonText,elements} = props;

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleCancel(event) {
    event.preventDefault();
    cancel();
  }

  // User may export this component and provide methods for the form to execute as props
  return (
    <div>
      <ErrorsDisplay errors={errors} />
      <form onSubmit={handleSubmit}>
        {elements()}
        <div className="pad-bottom">
          <button className="button" type="submit">{submitButtonText}</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// Error display measures if there are any errors, and will map them out if length is greater than zero.
function ErrorsDisplay({ errors }) {
  let errorsDisplay = null;
  if (errors.length) {
    errorsDisplay = (
      <div className="validation--errors">
        <h3>Validation errors</h3>
        
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        
      </div>
    );
  }

  return errorsDisplay;
}

export default Form;
