import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { ProductLine } from "@/interfaces/product-lines/product-lines.interface";
import { auth } from "@/utils/auth";

export async function getProductLines(): Promise<ProductLine[] | ErrorResp | [] > {
    const endpoint = `${process.env.BACKEND_URL}/product-lines`;
    const apikey = process.env.API_KEY as string;
    const session = await auth();
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
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.user.accessTokenBack}`,
              },
        });
        if (response.ok) {
            const data: ProductLine[] = await response.json();
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