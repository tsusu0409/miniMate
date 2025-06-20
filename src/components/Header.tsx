import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function Header() {

    return(
        <div className='header-container'>
            <div className='header-title'>
                <Link to='/'>
                    <FontAwesomeIcon icon={faFireFlameCurved} style={{color: 'white'}} className='icon-fire'/>
                    <p className='prj-title'>miniMate</p>
                </Link>
            </div>
        </div>
    );
}

export default Header;