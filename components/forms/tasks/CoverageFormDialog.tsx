"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { coverageFormSchema, CoverageFormValues } from "@/lib/validations";
import { formatDateIsoToString } from "@/utils/formatDate";

const coverageTypes = [
  { value: "basic", label: "Básica" },
  { value: "standard", label: "Estándar" },
  { value: "premium", label: "Premium" },
];

interface Props {
  id: string;
  onClose: () => void;
  datePlanned: string;
}

export function CoverageFormDialog(props: Props) {
  const { id, onClose, datePlanned } = props;

  const form = useForm<CoverageFormValues>({
    resolver: zodResolver(coverageFormSchema),
    defaultValues: {
      clientName: "",
      clientRut: "",
      clientAddress: "",
      executiveName: "",
      executiveEmail: "",
      executivePhone: "",
      notes: "",
    },
  });

  function onSubmit(data: CoverageFormValues) {
    console.log(data);
    onClose();
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex">
          {/* Barra lateral amarilla */}
          <div className="w-5 bg-blue-400" />

          <div className="flex-1 p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6" />

                    <span> Cobertura id: {id}</span>
                  </div>
                  <span>
                    Fecha de planificación: {formatDateIsoToString(datePlanned)}
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-base text-muted-foreground">
                    Tarea por vencer
                  </span>
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z" />
                  </svg>
                </div>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Vencimiento: 31/03/2025
              </p>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  {/* Columna izquierda */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold">Datos cliente</h2>
                      <div className="grid gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre Apellido Apellido"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="clientRut"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RUT Cliente</FormLabel>
                              <FormControl>
                                <Input placeholder="11.111.111-1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="clientAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input placeholder="+56987654321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        Registro cobertura
                      </h2>
                      <div className="grid gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="coverageDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fecha de cobertura</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full pl-3 text-left font-normal ${
                                        !field.value && "text-muted-foreground"
                                      }`}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", {
                                          locale: es,
                                        })
                                      ) : (
                                        <span>Seleccionar fecha</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      date > new Date("2025-03-31")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="coverageType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de cobertura</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo de cobertura" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {coverageTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Datos de contacto
                      </h2>
                      <div className="grid gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="executiveName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre ejecutivo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre Apellido Apellido"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="executiveEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ejecutivo@cliente.cl"
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="executivePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono</FormLabel>
                              <FormControl>
                                <Input placeholder="+56987654321" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Escriba aquí cualquier nota adicional..."
                              className="min-h-[180px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={() => onClose()}
                    className="border-2 border-gray-500 text-gray-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-gray-700 transition-all duration-150 ease-in-out"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="border-2 border-blue-500 text-blue-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
