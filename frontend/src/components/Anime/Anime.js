import {useState, useRef, useEffect, useCallback} from 'react';
import Container from '../../UIElements/Container';
import Spinners from '../../UIElements/Spinner';
import Paginations from '../../UIElements/Paginations';
import Search from '../../UIElements/Search';
import AnimeCard from './AnimeCard';
import useHttpClient from '../../hooks/http-hook';
import classes from './Anime.module.css';

const Anime = () =>{
    const animeInputRef = useRef();
    const {isLoading, request} = useHttpClient();
    const [animeList, setAnimeList] = useState([]);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    
    const getAnime = useCallback(async () => {
        //scrolls to the top of the page
        window.scrollTo (0,0); 
        const enteredAnime = animeInputRef.current.value;
        let response;
        try{
            if(enteredAnime.length === 0) {
                response = await request(`https://api.jikan.moe/v4/seasons/now?page=${page}`)
            }else{
                // stays on current anime search
                response = await request(`https://api.jikan.moe/v4/anime?q=${enteredAnime}&page=${page}&sfw`);
            }
            setAnimeList(response.data);
            setMaxPage(response.pagination.last_visible_page);
        }catch (error){
            alert(error);
            window.location.reload();
        }
    },[page, request]); 
    // If page change, react re-renders.
    // Ex: Manually setting setPage(1) when value of page isnt 1 in catch block of submitHandler
    
    const submitHandler = async event => {
        event.preventDefault();
        const enteredAnime = animeInputRef.current.value;
        let response;
        try {
            if(enteredAnime.length === 0) {
                return window.location.reload();
            }else{
                response = await request(`https://api.jikan.moe/v4/anime?q=${enteredAnime}&sfw`);
            }
            if(response.data.length === 0) {
                throw new Error ('Anime does not exist');
            }
            setAnimeList(response.data);
            setMaxPage(response.pagination.last_visible_page);
            setPage(1);
        }catch (error){
            alert(error);
            window.location.reload();
        }
    }

    useEffect(() => {
        getAnime();
    }, [getAnime]);

    return (
        <Container>
            {isLoading && <Spinners/>}
            <h1 className={classes.header}>Track Your Anime!</h1>  
            <Search 
            ref={animeInputRef}
            onSubmit = {submitHandler}
            />
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
            />
        </Container>
    );
}
export default Anime