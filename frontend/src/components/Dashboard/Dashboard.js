import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import AnimeCard from '../Anime/AnimeCard';
import Spinners from '../../UIElements/Spinner';
import Container from '../../UIElements/Container';

import classes from './Dashboard.module.css';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadedAnimes, setLoadedAnimes] = useState([]);

    const userId = useParams().userID;
    useEffect(() => {
        const sendRequest = async () =>{
            setIsLoading(true);
            try{
                const response = await fetch(`http://localhost:5000/dashboard/${userId}`);
                const result = await response.json();
                setLoadedAnimes(result.animes);
            } catch (error) {
                alert (error);
            }
            setIsLoading(false);
        }
        sendRequest();
    }, [userId]);
    
    return(
        <Container>
            {isLoading && <Spinners/>}
            <h1 className={classes.header}>Your Anime Lists!</h1>  
            <main>
                {loadedAnimes.map(anime => (
                    <AnimeCard
                        anime={anime}
                        danger={true}
                        key={anime.id} />
                ))}
            </main>
        </Container>
    )
}

export default Dashboard;