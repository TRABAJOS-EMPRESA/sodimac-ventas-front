"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import { signIn } from "next-auth/react";
import { signIn } from "next-auth/react";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN-IN" | "SIGN-UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const [seePass, setSeePass] = useState(false);

  const handleSubmit: SubmitHandler<T> = async () => {
    onSubmit(form.getValues());
  };

  const buttonText = formType === "SIGN-IN" ? "Inicia Sesión" : "Registrate";
  const subButtonText =
    formType === "SIGN-IN"
      ? "Ingresa tus datos de Usuario"
      : "Ingresa tus datos";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-5"
      >
        <h1 className="mt-10 font-bold">{buttonText}</h1>

        <p className="text-gray-400">{subButtonText}</p>

        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormControl>
                  <div className="relative w-full">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Image
                        onClick={
                          field.name === "password"
                            ? () => setSeePass(!seePass)
                            : undefined
                        }
                        src={
                          field.name === "password"
                            ? "/img/icons/login-icons/lock.png"
                            : "/img/icons/login-icons/envelope.png"
                        }
                        alt="email"
                        className={
                          field.name === "password" ? "cursor-pointer" : ""
                        }
                        width={20}
                        height={20}
                      />
                    </div>
                    <Input
                    disabled
                      required
                      type={
                        field.name === "password"
                          ? seePass
                            ? "text"
                            : "password"
                          : "text"
                      }
                      {...field}
                      className="pl-10 min-h-12  rounded-1.5 border focus:border-primary-blue"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          className="bg-primary-blue hover:bg-blue-500 text-primary-white  min-h-11 w-full rounded-full"
          disabled
        >
          {form.formState.isSubmitting
            ? buttonText === "Inicia Sesión"
              ? "Iniciando Sesión..."
              : "Registrando..."
            : buttonText}
        </Button>
      </form>
      <Button
        className="bg-primary-white border border-primary-blue hover:bg-primary-blue hover:text-primary-white mt-2 text-primary-blue min-h-11 w-full rounded-full"
        disabled={form.formState.isSubmitting}
        onClick={() => signIn("keycloak")}
      >
        Inicia Sesión en <span className="font-bold">NT</span>
      </Button>
    </Form>
  );
};

export default AuthForm;
