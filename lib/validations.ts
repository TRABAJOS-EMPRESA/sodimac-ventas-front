import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Email inválido" }),

  password: z.string().min(1, { message: "La contraseña es requerida" }),
  // .max(100,{message: "La contraseña no puede tener más de 50 caracteres"})
  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: "La contraseña debe tener al menos una mayúscula, una minúscula y un número" })
});

export const opportunitySchema = z.object({
  // Client and location identification
  opportunityName: z.string().min(2, {
    message: "El nombre de la oportunidad debe tener al menos 2 caracteres.",
  }),
  clientName: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  // clientRut: z.string().regex(/^\d{7,8}-[\dkK]$/, {
  //   message: "RUT inválido. Formato: 12345678-9",
  // }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  region: z.string({
    required_error: "Por favor seleccione una región.",
  }),
  commune: z.string({
    required_error: "Por favor seleccione una comuna.",
  }),

  contactName: z.string().min(2, {
    message: "El nombre del contacto debe tener al menos 2 caracteres.",
  }),
  phone: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres." })
    .max(12, { message: "El teléfono no puede tener más de 12 caracteres." })
    .regex(/^[+0-9]+$/, {
      message: "Solo se permiten números y el símbolo '+'.",
    }),
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),

  projectType: z.string({
    required_error: "Por favor seleccione un tipo de proyecto.",
  }),
  income: z
    .string()
    .min(1, { message: "Por favor ingrese el monto." })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, {
      message: "El monto no puede ser negativo.",
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
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;

export const dialogTableOpportunityFormSchema = z.object({
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  endDate: z.date({
    required_error: "La fecha de cierre es requerida",
  }),
  amount: z.string().min(1, "El monto es requerido"),
  description: z
    .string()
    .max(300, "La descripción no puede exceder 300 caracteres"),
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        url: z.string(),
      })
    )
    .optional(),
  comments: z
    .array(
      z.object({
        text: z.string(),
        date: z.date(),
      })
    )
    .optional(),
});

export type DialogTableOpportunityFormSchema = z.infer<
  typeof dialogTableOpportunityFormSchema
>;

// FORMULARIO DE COBERTURARS

export const coverageFormSchema = z.object({
  clientName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  clientRut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/, {
    message: "RUT inválido. Formato: 12.345.678-9",
  }),
  clientAddress: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  executiveName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  executiveEmail: z.string().email({
    message: "Email inválido.",
  }),
  executivePhone: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 dígitos.",
  }),
  coverageDate: z.date({
    required_error: "La fecha de cobertura es requerida.",
  }),
  coverageType: z.string({
    required_error: "El tipo de cobertura es requerido.",
  }),
  notes: z.string().optional(),
});

export type CoverageFormValues = z.infer<typeof coverageFormSchema>;
