import './Header.css';
import { Link } from 'react-router-dom';


function Header() {

    return(
        <div className='header-container'>
            <div className='header-title'>
                <Link to='/'>
                    <img src="?assets/icons/fire-flame-curved-solid.svg" />
                    <p className='prj-title'>miniMate</p>
                </Link>
            </div>
        </div>
    );
}

export default Header;