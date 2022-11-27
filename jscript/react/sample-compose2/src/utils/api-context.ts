import { createContext, useContext } from 'react';

export type ApiContextType = {
    // The URL to the api.
    apiUrl: string;

    // The name of the app.
    appName: string;

    // The access token provider.
    accessToken: (force: boolean) => Promise<string>;
}

export const ApiContext = createContext<ApiContextType>({} as any);

export function useApiContext() {
    return useContext(ApiContext);
}

const PROD = window.location.search?.indexOf('prod=1') > 0;

export const CONFIG = PROD ? {
    url: 'https://cloud.squidex.io',
    appName: 'hotels',
    clientId: 'hotels:default',
    clientSecret: 'ZxmQGgouOUmyVU4fh38QOCqKja3IH1vPu1dUx40KDec='
} : {
    url:  'https://localhost:5001',
    appName: 'hotels',
    clientId: 'hotels:default',
    clientSecret: 'pwiw7ui7gx3xmgcftvdp9rygvr1aos7t2ssmh2k0rfcx'
};

function getBearerToken() {
    return localStorage.getItem('token');
}

function setBearerToken(token: string) {
    localStorage.setItem('token', token);
}

export async function fetchBearerToken(force: boolean) {
    // Check if we have already a bearer token in local store.
    let token: string | null = null;
    
    if (!force) {
        token = getBearerToken();
    }

    if (token) {
        return token;
    }

    const body = `grant_type=client_credentials&scope=squidex-api&client_id=${CONFIG.clientId}&client_secret=${CONFIG.clientSecret}`;

    // Get the bearer token. Ensure that we use a client id with readonly permissions.
    const response = await fetch(`${CONFIG.url}/identity-server/connect/token`, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body 
    });

    if (!response.ok) {
        throw new Error(`Failed to retrieve token, got ${response.statusText}`);
    }

    const json = await response.json();

    token = json.access_token;

    // Cache the bearer token in the local store.
    if (token) {
        setBearerToken(token);
    }

    return token!;
}

export function createDefaultApiContext(): ApiContextType {
    return {  apiUrl: CONFIG.url, appName: CONFIG.appName, accessToken: fetchBearerToken };   
}