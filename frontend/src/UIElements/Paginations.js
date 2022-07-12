import { Pagination } from 'react-bootstrap';
import classes from './Pagination.module.css';
const Paginations = (props) => {
    let items = [];

    const pageChangeHandler = event =>{
        props.setPage(event.target.innerText);
    };

    for (let number = 1; number <=props.maxPage; number++) {
        items.push(
            <Pagination.Item 
            key={number} 
            active={number === +props.page}
            disabled={number === +props.page}
            onClick={pageChangeHandler}>
                {number}
            </Pagination.Item>,
        );
    }

    return(
        <Pagination className={classes.flex}onClick={props.getAnime}>
            {items}
        </Pagination>
    )
}

export default Paginations;