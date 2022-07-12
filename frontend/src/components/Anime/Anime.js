import {useState, useRef, useEffect, useCallback} from 'react';
import { FaSearch } from 'react-icons/fa';
import Container from '../../UIElements/Container';
import Spinners from '../../UIElements/Spinner';
import Paginations from '../../UIElements/Paginations';
import AnimeCard from './AnimeCard';
import classes from './Anime.module.css';

const Anime = () =>{
    const animeInputRef = useRef();
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    
    const getAnime = useCallback(async () => {
        window.scrollTo (0,0); //scrolls to the top of the page
        const enteredAnime = animeInputRef.current.value;
        let response, results;
        setIsLoading(true);
        try{
            if(enteredAnime.length === 0) {
                response = await fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}`)
            }else{
                // stays on current anime search
                response = await fetch(`https://api.jikan.moe/v4/anime?q=${enteredAnime}&page=${page}&sfw`);
            }
            results = await response.json();
        }catch (error){
            alert(error.message);
            window.location.reload();
        }
        setAnimeList(results.data);
        setMaxPage(results.pagination.last_visible_page);
        setIsLoading(false);
    },[page]); // if page change, react re-renders.
               // Ex: Manually setting setPage(1) when value of page isnt 1 in catch block of submitHandler
    
    const submitHandler = async event => {
        event.preventDefault();
        const enteredAnime = animeInputRef.current.value;
        let response, results;
        setIsLoading(true);
        try {
            if(enteredAnime.length === 0) {
                return window.location.reload();
            }else{
                response = await fetch(`https://api.jikan.moe/v4/anime?q=${enteredAnime}&sfw`);
                results = await response.json();
            }
            if(results.data.length === 0) {
                throw new Error ('Anime does not exist');
            }
        }catch (error){
            alert(error.message);
            window.location.reload();
        }
        setAnimeList(results.data);
        setMaxPage(results.pagination.last_visible_page);
        setPage(1);
        setIsLoading(false);
    }

    useEffect(() => {
        getAnime();
    }, [getAnime]);

    return (
        <Container className={classes.flex}>
            {isLoading && <Spinners/>}
            <h1 className={classes.header}>Track Your Anime!</h1>  
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                <span onClick={submitHandler}><FaSearch/></span>
                <input 
                    type ='text' 
                    id = 'anime'
                    ref={animeInputRef}
                    placeholder='Search'
                />
                </div>
            </form>
            <main>
                {animeList.map(anime => (
                    <AnimeCard
                        anime={anime}
                        danger={false}
                        key={anime.mal_id} />
                ))}
            </main>
            <Paginations 
                maxPage = {maxPage}
                setPage={setPage}
                page={page}
                onClick={getAnime}
            />
        </Container>
    );
}
export default Anime