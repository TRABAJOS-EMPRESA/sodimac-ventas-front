'use server'

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { ProjectType } from "@/interfaces/project-types/project-types.interface";

export async function getProjectTypes(): Promise<ProjectType[] | ErrorResp | [] > {
    const endpoint = `${process.env.BACKEND_URL}/project-types`;
    const apikey = process.env.API_KEY as string;
    // console.log("endpoint", endpoint);  
    // console.log("apikey desde projecttttttttt", apikey);
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
            const data: ProjectType[] = await response.json();

            // console.log("data desde project types action", data);
            
            return data;
        } else {
            const errorData: ErrorResp = await response.json();
            console.log("errorData", errorData);
            return errorData;
        }
    } catch (error) {

        console.log( "error desde project types action", error);
        
        return {
            error: "NetworkError",
            message: (error as Error).message,
            statusCode: 500,
        };
    }

}