import {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card} from 'react-bootstrap';

import Container from '../../UIElements/Container';
import Spinners from '../../UIElements/Spinner';
import AuthContext from '../../store/auth-context';
import classes from './Auth.module.css';
import yourNameHeader from '../../assets/yourNameHeader.jpg'

const Auth = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');

    const emailInputChangeHandler = event => {
      setEnteredEmail(event.target.value);
    };

    const passwordInputChangeHandler = event => {
      setEnteredPassword(event.target.value);
    };
    
    const confirmPasswordInputChangeHandler = event => {
      setEnteredConfirmPassword(event.target.value);
    };

    const switchAuthModeHandler = () => {
      setIsLogin((prevState) => !prevState);
    };

    const submitHandler = async event => {
      event.preventDefault();
      setIsLoading(true);

      if(isLogin) {
        try {
          const user = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword
            })
          });
          const response = await user.json();
          if (!user.ok) {
            throw new Error(response.message);
          }
          authCtx.onLogin(response.userId, response.token);
          navigate('/');
        }catch (error) {
          alert(error);
        }
      }else{
        try{
          const user = await fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
              confirm_password: enteredConfirmPassword
            })
          });
          const response = await user.json();

          if (!user.ok) {
            throw new Error(response.message);
          }
          authCtx.onLogin(response.userId, response.token);
          navigate('/');
        }catch (error){
          alert(error);
        }
      }
      
      setIsLoading(false);
      setEnteredEmail('');
      setEnteredPassword('');
      setEnteredConfirmPassword('');
    }

    return (
      <Container className={classes.flex}>
        {isLoading && <Spinners/>}
        <form onSubmit={submitHandler}>
          <Card className={classes.card}>
            <Card.Img variant="top" src={yourNameHeader} />
            <Card.Body>
            <h2 className={classes.header}>{isLogin ? 'Login' : 'Sign Up'}</h2>
            
            <div className={classes.control}>
              <label htmlFor='email'>Email</label>
              <input 
                type ='email' 
                id = 'email'
                onChange={emailInputChangeHandler}
                value={enteredEmail}
                required />
            </div>

            <div className={classes.control}>
              <label htmlFor='password'>Password</label>
              <input 
                type ='password' 
                id = 'password' 
                onChange={passwordInputChangeHandler}
                value={enteredPassword} 
                required />
            </div>

            {!isLogin && 
              <div className={classes.control}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input 
                  type ='password' 
                  id = 'confirmPassword' 
                  onChange={confirmPasswordInputChangeHandler}
                  value={enteredConfirmPassword} 
                  minLength="6"
                  required />
              </div>
            }
            
            <div className={classes.actions}>
              <button variant="primary" size="lg">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
              <p onClick={switchAuthModeHandler}> 
                {isLogin ? 'Create new account' : 'Login with existing account'}
              </p>
            </div>

            </Card.Body>     
          </Card>
        </form>
      </Container>

    );
}
export default Auth