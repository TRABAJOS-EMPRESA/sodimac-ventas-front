'use server'

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetOpportunity } from "@/interfaces/opportunities/get-opportunities-all.interface";

export async function getOpportunitiesAll(): Promise<GetOpportunity[] | ErrorResp | [] > {
    const endpoint = `${process.env.BACKEND_URL}/opportunities/all`;
    const apikey = process.env.API_KEY as string;
    // console.log("endpoint", endpoint);  
    // console.log("apikey", apikey);
    if (!apikey) {
        const error: ErrorResp = {
            message: "API key no está configurada",
            error: "ConfigError",
            statusCode: 400,
        };  
        return error;
    }
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "api-key": apikey,
            },
        });
        if (response.ok) {
            const data: GetOpportunity[] = await response.json();
            return data;
        } else {
            const errorData: ErrorResp = await response.json();
            console.log("errorData", errorData);
            return errorData;
        }
    } catch (error) {
        return {
            error: "NetworkError",
            message: (error as Error).message,
            statusCode: 500,
        };
    }

}