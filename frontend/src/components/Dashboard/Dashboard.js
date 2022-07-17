import {useState, useEffect, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import AnimeCard from '../Anime/AnimeCard';
import Spinners from '../../UIElements/Spinner';
import Container from '../../UIElements/Container';
import Search from '../../UIElements/Search';
import useHttpClient from '../../hooks/http-hook';
import classes from '../Anime/Anime.module.css'

const Dashboard = () => {
    const animeInputRef = useRef();
    const {isLoading, request} = useHttpClient();
    const [loadedAnimes, setLoadedAnimes] = useState([]);

    const userId = useParams().userId;
    const sendRequest = useCallback(async () => {
        try{
            const response = await request(`http://localhost:5000/dashboard/${userId}`);
            setLoadedAnimes(response.animes);
        } catch (error) {
            alert (error);
        }
    }, [userId, request])
    
    
    const submitHandler = async event => {
        event.preventDefault();
        const enteredAnime = animeInputRef.current.value;
        let response;
        try {
            if(enteredAnime.length === 0) {
                return window.location.reload();
            }else{
                response = await request(`http://localhost:5000/dashboard/${userId}/${enteredAnime}`);
            }
            if(response.animes.length === 0) {
                throw new Error ('Anime does not exist');
            }
            setLoadedAnimes(response.animes);
        }catch (error){
            alert(error.message);
            window.location.reload();
        }
    }

    const deleteAnimeHandler = (animeId) => {
        setLoadedAnimes(updatedList => 
            updatedList.filter(
                anime => anime.id !== animeId))
    }

    useEffect(() => {
        sendRequest();
    }, [sendRequest])

    return(
        <Container>
            {isLoading && <Spinners/>}
            <h1 className={classes.header}>Your Anime Lists!</h1>  
            <Search 
            ref={animeInputRef}
            onSubmit = {submitHandler}
            />
            <main>
                {loadedAnimes.map(anime => (
                    <AnimeCard
                        anime={anime}
                        danger={true}
                        key={anime.id}
                        onDelete={deleteAnimeHandler} />
                ))}
            </main>
        </Container>
    )
}

export default Dashboard;