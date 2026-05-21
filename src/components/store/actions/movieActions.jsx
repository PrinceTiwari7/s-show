export { removemovie } from '../reducers/movieSlice';
import axios from '../../../utils/Axios';
import { loadmovie } from '../reducers/movieSlice';

export const asyncloadmovie = (id) => async (dispatch) => {
    try {
        const detail = await axios.get(`/movie/${id}`);
        const externalid = await axios.get(`/movie/${id}/external_ids`);
        const recommendations = await axios.get(`/movie/${id}/recommendations`);
        const videos = await axios.get(`/movie/${id}/videos`);
        const similar = await axios.get(`/movie/${id}/similar`);
        const translations = await axios.get(`/movie/${id}/translations`);
        const watchproviders = await axios.get(`/movie/${id}/watch/providers`);

        // ✅ fixed: watchproviders.data.results is an object keyed by country code, not an array
        // Extract IN (India) providers if available, otherwise first country, otherwise null
        const wpResults = watchproviders.data.results;
        const wpData = wpResults?.IN || wpResults?.[Object.keys(wpResults)[0]] || null;

        let theultimatedetails = {
            detail: detail.data,
            externalid: externalid.data,
            recommendations: recommendations.data.results,
            videos: videos.data.results.find(m => m.type === 'Trailer'),
            similar: similar.data.results,
            watchproviders: wpData,
            translations: translations.data.translations.map(t => t.name)
        };

        dispatch(loadmovie(theultimatedetails));
    } catch (error) {
        console.log("Error:", error);
    }
};
