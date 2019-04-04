import axios from 'axios';
import { GET_ERRORS } from './types';
// Register User

export const registerUser = (userData) => dispatch =>{

    axios.post('/api/users/register',  newUser)
      .then(result => console.log(result.data))
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.reponse.data
        })
        );
}