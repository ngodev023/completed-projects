// components checks if app component's loading state is true or not then renders loading or results.
const NoResults = (props) => (
   (props.loadState)
      ? <h1>Loading...</h1>
      : <div>
      <h1>No results found</h1>
      <p>The search did not return any results. Please try again.</p>
 </div>
   
   
)

export default NoResults;