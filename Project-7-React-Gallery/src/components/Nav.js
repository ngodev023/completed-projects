import {Link} from 'react-router-dom';

// onclick, each link will redirect browser to specified url, 
// which invokes api fetch and rerender of photolist component.
const Nav = () => (
    <nav className="main-nav">
        <ul>
          <li><Link to='/search/cats'>Cats</Link></li>
          <li><Link to='/search/dogs'>Dogs</Link></li>
          <li><Link to='/search/computers'>Computers</Link></li>
        </ul>
    </nav>
)

export default Nav;