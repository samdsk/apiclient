import axios, { CreateAxiosDefaults } from "axios";
import {AuthResponse} from './types.js';
import * as dotenv from 'dotenv';

dotenv.config();

const Authentication = async (username:string, password:string): Promise<AuthResponse> => {
    const response = await axios.post(`${process.env.BASE_URL}/login`,{
        "username":username,
        "password":password
    });

    return response.data;    
}

const getInstance = async (username:string, password:string) => {
    const auth = await Authentication(username,password);
    const token = auth.access_token;

    let config : CreateAxiosDefaults = {
        baseURL: process.env.BASE_URL,
        headers: {
            Accept:'application/json',
            "Content-Type":'application/json',
            Authorization:`Bearer ${token}`
        }
    }

    const instance = axios.create(config);

    instance.interceptors.response.use(response => response, async (error) => {
        console.log(error.response);
        
        if(error.response && (error.response.status === 401 || error.response.status === 403)){
            try {
                const auth = await Authentication(username, password);
                error.config.headers.Authorization = `Bearer ${auth.access_token}`;
                return instance(error.config);
            } catch (err) {
                throw err;
            }
        }
        return Promise.reject(error);
    });

    return instance;
}

const sleep = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const instance = await getInstance("sam", "password");
    console.log("first");
    
    await instance.get('/projects');  

    await sleep(5000);
    console.log("second");    
    await instance.get('/projects');  


    
})();