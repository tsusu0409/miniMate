import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';


function Header() {

    return(
        <div className='header-container'>
            <div className='header-title'>
                <FontAwesomeIcon icon={faFireFlameCurved} style={{color: 'white'}} className='icon-fire'/>
                <p className='prj-title'>miniMate</p>
            </div>
            <div className='header-links'>
                <FontAwesomeIcon icon={faGear} style={{color: 'white'}} className='icon-gear'/>
            </div>
        </div>
    );
}

export default Header;