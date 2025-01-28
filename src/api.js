import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';


const PUBLIC_KEY = '023a6770979262ca4005284ed5497701';
const PRIVATE_KEY = '675f4f6a398ca09db64bede0d262a80909a747f8';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    try {

        const ts = new Date().getTime().toString();
        const hash = await getHash(PUBLIC_KEY,PRIVATE_KEY,ts);
        const fullUrl = `${url}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

        const response = await fetch(fullUrl, {
            headers : {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const jsonResponse = await response.json();

        const characters = jsonResponse.data.results
            .filter(character => character.thumbnail && !character.thumbnail.path.includes('image_not_available'))
            .map(character => ({
                name: character.name,
                description: character.description || 'Aucune description disponible',
                imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
            }));

        console.log(characters);
        return Promise.resolve(characters);

    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    return Promise.resolve(CryptoJS.MD5(timestamp + privateKey + publicKey).toString());
}