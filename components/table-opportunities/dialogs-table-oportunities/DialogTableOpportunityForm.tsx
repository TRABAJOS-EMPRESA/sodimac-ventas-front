"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Upload, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
// import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dialogTableOpportunityFormSchema,
  DialogTableOpportunityFormSchema,
} from "@/lib/validations";
import { Opportunity } from "@/constants/column-config.constant";



interface Props {
  opportunity: Opportunity;
  onClose: () => void;
}

function DialogTableOpportunityForm(props: Props) {


  const { opportunity, onClose } = props;
  
  // const [open, setOpen] = useState(true);

  const form = useForm<DialogTableOpportunityFormSchema>({
    resolver: zodResolver(dialogTableOpportunityFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      amount: "", 
      description: "",
      files: [],
      comments: [], 
    },
  });
  

  function onSubmit(data: DialogTableOpportunityFormSchema) {
    console.log(data);
    // onClose();
  }

  const timeline = [
    { status: "Op. iniciada", date: "15/10/2020 10:30" },
    { status: "Cobertura", date: "15/10/2022 14:00" },
    { status: "Shipped", date: "15/10/2022 16:15" },
    { status: "Delivered", date: "16/10/2022 10:00" },
  ];

  return (
    <Dialog open={!!opportunity}  onOpenChange={onClose}>
      <DialogContent className="w-full md:max-w-[1200px] max-h-[calc(100vh-100px)] overflow-y-auto p-10">
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:flex-1 md:p-6">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-semibold">
                {opportunity.oportunidadPadre}
              </DialogTitle>
              <div className="mt-2 text-sm text-muted-foreground">
                <div className="font-medium text-xs uppercase tracking-wider text-gray-500">
                  {opportunity.nombreCliente}
                </div>
                <div>{opportunity.rut}</div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Datos de la oportunidad hija
                  </h3>

                  <div className="grid  grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm mb-2">
                            Fecha de inicio
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-10",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? format(new Date(field.value), "dd/MM/yyyy") 
                                    : "Seleccione fecha inicio"}
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm mb-2">
                            Fecha de cierre
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-10",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? format(new Date(field.value), "dd/MM/yyyy") 
                                    : "Seleccione fecha cierre"}
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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm mb-2">Monto</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Monto $"
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm mb-2">
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Descripción"
                            className="min-h-[120px] resize-none"
                            maxLength={300}
                            {...field}
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value?.length || 0}/300 caracteres
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Cotizaciones</h3>
                    <Button type="button" variant="secondary" className="h-9">
                      <Upload className="mr-2 h-4 w-4" />
                      Cargar archivo
                    </Button>
                  </div>

                  <div className="rounded-lg border">
                    <div className="p-4 space-y-1">
                      {[
                        { name: "nombre_archivo.png", size: "124.488 KB" },
                        { name: "nombre_archivo.pdf", size: "124.488 KB" },
                      ].map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {file.size}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:space-y-4 w-full">
                  <h3 className="text-lg font-semibold">Comentarios</h3>
                  <div className="md:space-y-4 w-full">
                    <div className="flex gap-3">
                      <Avatar className="md:h-8 md:w-8" />
                      <Input placeholder="Comentario" className="h-10" />
                    </div>
                    {[
                      "Cliente contactado, sin mayor respuesta, indica volver a llamar el 15/01/2025",
                      "Cliente contactado, sin mayor respuesta, indica volver a llamar el 15/01/2025",
                    ].map((comment, i) => (
                      <div key={i} className="md:flex md:gap-3">
                        <Avatar className="h-8 w-8" />
                        <div className="flex-1 rounded-lg border bg-gray-50/50 p-3">
                          <div className="text-sm">{comment}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            01/12/2024
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex w-full md:justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onClose()}
                    className="h-9 w-full"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="h-9 w-full">
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="w-full md:w-[300px] md:border-l">
            <div className="md:p-6 pt-6 space-y-6">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="closed">Cerrado</SelectItem>
                </SelectContent>
              </Select>

              <div className="rounded-lg bg-gray-50 px-4 py-2 text-center text-sm font-medium">
                Tipo de proyecto
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-4">
                  Historial de acciones y cambios de estado de la oportunidad
                </h3>
                <div className="relative">
                  <div className="absolute left-[15px] top-2 h-[calc(100%-16px)] w-[2px] bg-gray-200" />
                  <div className="space-y-6">
                    {timeline.map((item, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-[7px] h-3 w-3 rounded-full border-[3px] border-blue-500 bg-white" />
                        <div className="text-sm font-medium">{item.status}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogTableOpportunityForm;
