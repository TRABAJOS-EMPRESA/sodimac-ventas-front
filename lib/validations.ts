import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string()
        .min(1,{message: "El email es requerido"})
        .email({ message: "Email inválido" }),

    password: z.string()
        .min(1,{message: "La contraseña es requerida"})
        // .max(100,{message: "La contraseña no puede tener más de 50 caracteres"})
        // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: "La contraseña debe tener al menos una mayúscula, una minúscula y un número" })
    
})