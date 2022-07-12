import {Link} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import {FaHome, FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import {MdDashboard} from "react-icons/md";
import AuthContext from '../../store/auth-context';
import classes from './Navigation.module.css';
import { useContext } from 'react';

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  const logout = () => {
    authCtx.onLogout();
  }
  
  return (
      <Navbar className={classes.navbar} collapseOnSelect expand="lg" variant="dark">
      <Navbar.Brand >ANIME TRACKER</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
            <Nav>
                <Link to = "/"><FaHome/></Link>

                {!authCtx.isLoggedIn && (
                  <Link to = "/auth"><FaSignInAlt/></Link>
                )}

                {authCtx.isLoggedIn && (
                  <Link to = {`/dashboard/${authCtx.userId}`}><MdDashboard/></Link>
                )}

                {authCtx.isLoggedIn && (
                  <Link to = "/" onClick={logout}><FaSignOutAlt/></Link>
                )}
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}
export default Navigation