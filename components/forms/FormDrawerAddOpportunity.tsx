"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, convertToExcelDate } from "@/lib/utils";
import { OpportunityFormValues, opportunitySchema } from "@/lib/validations";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getProjectTypes } from "@/actions/project-types/get-project-types.action";
import { ProjectType } from "@/interfaces/project-types/project-types.interface";
import { getStores } from "@/actions/stores/get-stores.action";
import { GetStoresResp } from "@/interfaces/stores/store.interface";
import { getRegions } from "@/actions/regions/get-regions.action";
import {
  Commune,
  GetRegionsResp,
} from "@/interfaces/regions/regions.interface";
import { Contact, GetClientResp } from "@/interfaces/client/client.interface";
import { getClients } from "@/actions/clients/get-clients-action.action";
import { useSession } from "next-auth/react";
import { createOpportunity } from "@/actions/create-opportunity/create-opportunity.action";
import { CreateOpportunityRequest } from "@/interfaces/opportunities/create-oportunity.interface";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual data from your API

interface Props {
  setIsOpen: (isOpen: boolean) => void;
}

function FormDrawerAddOpportunity(props: Props) {
  const { setIsOpen } = props;

  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  console.log("userid -->>>>>>", userId);

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [stores, setStores] = useState<GetStoresResp[]>([]);
  const [regions, setRegions] = useState<GetRegionsResp[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [clients, setClients] = useState<GetClientResp[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  const [filteredClients, setFilteredClients] = useState<GetClientResp[]>([]);
  const [inputValue, setInputValue] = useState(""); // Valor visible en el input
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

  console.log("userId", userId);

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      opportunityName: "",
      clientName: "",
      // clientRut: "",
      address: "",
      region: "",
      commune: "",
      contactName: "",
      phone: "",
      email: "",
      projectType: "",
      income: "0",
      store: "",
      startDate: undefined,
      endDate: undefined,
      description: "",
    },
  });

  async function onSubmit(data: OpportunityFormValues) {
    const mappedData = {
      opportunityName: data.opportunityName,
      workDirection: data.address,
      regionId:
        regions.find((region) => region.name === data.region)?.id || null,
      communeId:
        communes.find((commune) => commune.id === data.commune)?.id || null,
      storeId: stores.find((store) => store.name === data.store)?.id || null,
      projectTypeId:
        projectTypes.find((type) => type.name === data.projectType)?.id || null,
      productLineId:
        projectTypes.find((type) => type.name === data.projectType)?.id || null,
      executiveId: userId,
      clientId:
        clients.find((client) => client.name === data.clientName)?.id || null,
      contactIds:
        clients
          .find((client) => client.name === data.clientName)
          ?.contacts.map((c) => c.id) || null,
      availableBudget: parseInt(data.income),
      startDate: data.startDate
        ? convertToExcelDate(new Date(data.startDate))
        : null,
      endDate: data.endDate ? convertToExcelDate(new Date(data.endDate)) : null,
      description: data.description,
      statusId: "ef31d320-7150-42fc-a6a9-532f4e64ee26",
      salesTeam: "LORENA VERONICA RODRIGUEZ DIAZ",
      salesMethod: "venta general",
    };

    // console.log("Mapped Data:", mappedData);

    const objectCreateOp: CreateOpportunityRequest = {
      opportunityName: mappedData.opportunityName,
      workDirection: mappedData.workDirection,
      regionId: mappedData.regionId!,
      communeId: mappedData.communeId!,
      storeId: mappedData.storeId!,
      projectTypeId: mappedData.projectTypeId!,
      productLineId: mappedData.productLineId!,
      executiveId: mappedData.executiveId!,
      clientId: mappedData.clientId!,
      contactIds: mappedData.contactIds!,
      availableBudget: mappedData.availableBudget,
      startDate: mappedData.startDate!,
      endDate: mappedData.endDate!,
      description: mappedData.description,
      statusId: mappedData.statusId,
      salesTeam: mappedData.salesTeam,
      salesMethod: mappedData.salesMethod,
    };

    // console.log("OBJECT Data:", objectCreateOp);

    try {
      const resp = await createOpportunity(objectCreateOp);
      if ("error" in resp) {
        toast({
          variant: "destructive",
          className: 'bg-primary-blue text-white',
          title: "Error al crear oportunidad",
          description: resp.message,
          
        });
        console.log("Opportunity created successfully:", resp);
      } else {
        toast({
          variant: "default",
          className: 'bg-primary-blue text-white',
          title: "Oportunidad creada",
          description: "La oportunidad se ha creado exitosamente",
          
        });
        console.log("Opportunity created successfully:", resp);

        form.reset()
        setIsOpen(false);

      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const [projectTypesResp, storesResp, regionsResp, clientsResp] =
          await Promise.all([
            getProjectTypes(),
            getStores(),
            getRegions(),
            getClients(),
          ]);

        // Proyectos
        if (Array.isArray(projectTypesResp)) {
          setProjectTypes(projectTypesResp);
        } else {
          console.error(
            "Error al obtener los tipos de proyecto desde componente",
            projectTypesResp
          );
        }

        // Tiendas
        if (Array.isArray(storesResp)) {
          const uniqueStores = storesResp.filter(
            (store, index, self) =>
              index === self.findIndex((s) => s.name === store.name)
          );

          // console.log("uniqueStores", uniqueStores);

          setStores(uniqueStores);
        } else {
          console.error(
            "Error al obtener las tiendas desde componente",
            storesResp
          );
        }

        // Regiones
        if (Array.isArray(regionsResp)) {
          setRegions(regionsResp);
        } else {
          console.error("Error al obtener las regiones:", regionsResp);
        }

        // Clientes
        if (Array.isArray(clientsResp)) {
          setClients(clientsResp);
          setFilteredClients(clientsResp);
        } else {
          console.error("Error al obtener clientes:", clientsResp);
        }
      } catch (error) {
        console.error("Error al obtener datos desde componente", error);
      }
    };

    handleGetData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const results = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.rut.replace(".", "").includes(searchTerm.toLowerCase())
      );
      setFilteredClients(results);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, clients]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crear nueva oportunidad</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Identificación del cliente y ubicación de la oportunidad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opportunityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre oportunidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre oportunidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nombre cliente o Rut - Sin puntos</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* Input de búsqueda */}
                        <Input
                          className="w-full"
                          placeholder="Nombre cliente"
                          value={inputValue} // Muestra el valor seleccionado
                          onChange={(e) => {
                            setInputValue(e.target.value); // Actualiza lo que se ve en el input
                            setSearchTerm(e.target.value); // Actualiza el término de búsqueda
                            field.onChange(e.target.value); // Actualiza React Hook Form
                          }}
                        />

                        {/* Dropdown con resultados filtrados */}
                        {searchTerm.length > 0 &&
                          filteredClients.length > 0 && (
                            <div className="absolute z-10 bg-white border rounded shadow w-full max-h-60 overflow-auto">
                              {filteredClients.map((client) => (
                                <div
                                  key={client.id}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    form.setValue("clientName", client.name); // Actualiza React Hook Form
                                    setInputValue(client.name); // Muestra el cliente seleccionado
                                    setSearchTerm(""); // Limpia el término de búsqueda
                                    setFilteredClients([]); // Limpia los clientes filtrados
                                    setFilteredContacts(client.contacts); // Actualiza contactos
                                  }}
                                >
                                  {client.name}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="clientRut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUT Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="11111111-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección obra</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Región</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        // console.log("value", value);

                        const region = regions.find((r) => r.name === value);
                        setCommunes(region ? region.communes : []);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la región" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commune"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comuna</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la comuna" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {communes.map((commune) => (
                          <SelectItem key={commune.id} value={commune.id}>
                            {commune.name}
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

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Contacto del asociado</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de contacto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Seleccione un contacto"
                          {...field}
                        />

                        {filteredContacts.length > 0 && (
                          <div className="absolute z-10 bg-white border rounded shadow w-full max-h-60 overflow-auto">
                            {filteredContacts.map((contact) => (
                              <div
                                key={contact.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  form.setValue("contactName", contact.name);
                                  form.setValue("phone", contact.phone);
                                  form.setValue("email", contact.email);
                                  setFilteredContacts([]);
                                }}
                              >
                                {contact.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              En el caso de no encontrar el contacto en el listado, por favor
              agregarlo en la plataforma Siebel.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Características de la oportunidad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de proyecto</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo de proyecto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingresos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Monto en pesos"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="store"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tienda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una tienda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stores.map((store, index) => (
                          <SelectItem
                            key={`${store.name}-${index}`}
                            value={store.name}
                          >
                            {store.code} - {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>Seleccione fecha cierre</span>
                            )}

                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
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
                    <FormLabel>Fecha de cierre</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>Seleccione fecha cierre</span>
                            )}

                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la oportunidad"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0}/300 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              className="py-2 px-3 bg-gray-500 text-primary-white rounded-full "
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="py-2 px-3 bg-primary-blue text-primary-white rounded-full"
            >
              Crear oportunidad
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default FormDrawerAddOpportunity;
