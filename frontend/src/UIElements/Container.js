import classes from './Container.module.css';

const Section = props => {
    return (
        <section className={`${classes.container} ${props.className}`}>
            {props.children}
        </section>
    )
}
export default Section