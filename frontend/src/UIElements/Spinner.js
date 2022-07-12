import {Spinner} from 'react-bootstrap';
import classes from './Spinner.module.css';

const Spinners = () => {
    return <Spinner className = {classes.spinner} animation="border" variant="light"/>
}
export default Spinners;