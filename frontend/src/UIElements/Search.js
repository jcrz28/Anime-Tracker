import React from 'react';
import { FaSearch } from 'react-icons/fa';
import classes from './Search.module.css';

const Search = React.forwardRef((props, ref) => {
    return (
        <form className={classes.form} onSubmit={props.onSubmit}>
                <div className={classes.control}>
                <span onClick={props.onSubmit}><FaSearch/></span>
                <input 
                    type ='text' 
                    id = 'anime'
                    ref={ref}
                    placeholder='Search'
                />
                </div>
        </form>
    );
})

export default Search;