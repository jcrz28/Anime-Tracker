import React, { useState, useContext } from 'react'
import { Card, Button } from 'react-bootstrap';

import Modals from '../../UIElements/Modals';
import AuthContext from '../../store/auth-context';
import classes from './AnimeCard.module.css';

const AnimeCard = (props) => {
    const {anime, danger} = props
    const authCtx = useContext(AuthContext)
    const [modalShow, setModalShow] = useState(false);
    const [bump, setBump] = useState(false);

    const addAnime = async event => {
        event.preventDefault();
        setBump(true);
        try{
            const newAnime = await fetch(`http://localhost:5000/dashboard/${authCtx.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authCtx.token
                },
                body: JSON.stringify({
                    title: anime.title,
                    images:{
                        jpg:{
                            image_url: anime.images.jpg.image_url
                        }
                    },
                    creator: authCtx.userId
                })
            });
          const response = await newAnime.json();
          if (!newAnime.ok) {
            throw new Error(response.message);
          }
            
        }catch (error) {
            alert (error)
        }
        setBump(false);
    }

    const deleteAnime = async event => {
        event.preventDefault();
        try{
            const newAnime = await fetch(`http://localhost:5000/dashboard/${authCtx.userId}/${anime.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authCtx.token
                },
            });
          const response = await newAnime.json();
          if (!newAnime.ok) {
            throw new Error(response.message);
          }
          window.location.reload();
            
        }catch (error) {
            alert (error)
        }

    }
	return (
        <Card className={`${classes.card} ${bump? classes.bump: ''}`}>
            <Card.Img variant="top" src={anime.images.jpg.image_url} />
            <Card.Body>
                <Card.Title>{anime.title}</Card.Title>
            </Card.Body>

            <div className={classes.button}>

                {!danger && (
                    <Button variant="primary" onClick={() => setModalShow(true)}>
                    Synopsis
                    </Button>
                )}
               
                
                {authCtx.isLoggedIn && !danger && (
                    <Button variant="success" type="submit" onClick ={addAnime}>
                        Add
                    </Button>
                    
                )}

                {authCtx.isLoggedIn && danger &&(
                    <Button variant="danger" type="submit" onClick ={deleteAnime}>
                    Delete
                    </Button>
                )}
               
                <Modals
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    title={anime.title}
                    body={anime.synopsis}
                />
            </div>
        </Card>
        
	)
}

export default AnimeCard