export { removetv } from '../reducers/tvSlice';
import axios from '../../../utils/Axios';
import { loadtv } from '../reducers/tvSlice';

export const asyncloadtv = (id) => async (dispatch) => {
    try {
        const detail = await axios.get(`/tv/${id}`);
        const externalid = await axios.get(`/tv/${id}/external_ids`);
        const recommendations = await axios.get(`/tv/${id}/recommendations`);
        const videos = await axios.get(`/tv/${id}/videos`);
        const similar = await axios.get(`/tv/${id}/similar`);
        const translations = await axios.get(`/tv/${id}/translations`);
        const watchproviders = await axios.get(`/tv/${id}/watch/providers`);

        // ✅ fixed: same watchproviders fix as movie
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

        dispatch(loadtv(theultimatedetails));
    } catch (error) {
        console.log("Error:", error);
    }
};
