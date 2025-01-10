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


export const opportunitySchema = z.object({
  // Client and location identification
  opportunityName: z.string().min(2, {
    message: "El nombre de la oportunidad debe tener al menos 2 caracteres.",
  }),
  clientName: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  clientRut: z.string().regex(/^\d{7,8}-[\dkK]$/, {
    message: "RUT inválido. Formato: 12345678-9",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  region: z.string({
    required_error: "Por favor seleccione una región.",
  }),
  commune: z.string({
    required_error: "Por favor seleccione una comuna.",
  }),

  // Contact information
  contactName: z.string().min(2, {
    message: "El nombre del contacto debe tener al menos 2 caracteres.",
  }),
  phone: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),

  // Opportunity characteristics
  projectType: z.string({
    required_error: "Por favor seleccione un tipo de proyecto.",
  }),
  income: z.string().min(1, {
    message: "Por favor ingrese el monto.",
  }),
  store: z.string({
    required_error: "Por favor seleccione una tienda.",
  }),
  startDate: z.date({
    required_error: "Por favor seleccione una fecha de inicio.",
  }),
  endDate: z.date({
    required_error: "Por favor seleccione una fecha de cierre.",
  }),
  description: z.string().max(300, {
    message: "La descripción no puede exceder los 300 caracteres.",
  }),
})

export type OpportunityFormValues = z.infer<typeof opportunitySchema>

