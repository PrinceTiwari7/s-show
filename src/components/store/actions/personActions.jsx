export { removeperson } from '../reducers/personSlice';
import axios from '../../../utils/Axios';
import { loadperson } from '../reducers/personSlice';

export const asyncloadperson = (id) => async (dispatch) => {
    try {
        const detail = await axios.get(`/person/${id}`);
        const externalid = await axios.get(`/person/${id}/external_ids`);
        const movieCredits = await axios.get(`/person/${id}/movie_credits`);
        const tvCredits = await axios.get(`/person/${id}/tv_credits`);

        let theultimatedetails = {
            detail: detail.data,
            externalid: externalid.data,
            movieCredits: movieCredits.data,
            tvCredits: tvCredits.data
        };

        dispatch(loadperson(theultimatedetails));
    } catch (error) {
        console.log("Error:", error);
    }
};
