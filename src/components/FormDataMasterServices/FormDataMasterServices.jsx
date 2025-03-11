import { Col, Container, Row } from 'react-grid-system';
import { TextField, Select, MenuItem, Button, InputLabel } from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useEffect, useState } from 'react';
import './FormDataMasterServices.css';

const schemaServicesUnQuoted = z.object({
  name: z.string().min(1, 'El nombre es obligatoriounquoted'),
  service_type_id: z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),
  quantity: z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),

  unit_measure: z.enum(['gr', 'Kg', 'Tn'], {
    required_error: 'Selecciona un estado válido',
  }),
  unit_cost_value: z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),
  unit_sales_value: z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),
  authorized: z.boolean().refine((val) => val === true, {
    message: 'Debes autorizar el servicio',
  }),
});

const schemaServicesAdditional = z.object({
  name: z.string().min(1, 'El nombre es obligatorio adicional'),
  service_type_id:z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),

  quantity: z.number().gt(0, { message: 'Ingrese un número mayor a 0' }),
  unit_measure: z.enum(['gr', 'Kg', 'Tn'], {
    required_error: 'Selecciona un estado válido',
  }),
  unit_cost_value: z.optional(),
  unit_sales_value: z.optional(),
  authorized: z.boolean().optional(),
});




const FormDataMasterServices = ({ onSubmitData, title, typeServiceId, data=[]}) => {
  const [typeService, setTypeService] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    setError,
    getValues,
    clearErrors,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      service_type_id: 1,
    },
    resolver: zodResolver(typeService === 1 ? schemaServicesUnQuoted : schemaServicesAdditional), // Se inicia con un esquema por defecto
  });

  const serviceType = watch('service_type_id'); // Observar cambios en el select
  useEffect(() => {
    setTypeService(serviceType); // Actualizar el estado cuando cambie el valor
    if (serviceType !== 1) {
      clearErrors(['unit_cost_value', 'unit_sales_value', 'authorized']); // Limpiar errores de estos campos
    }
  }, [serviceType, clearErrors]);

  const formatCurrency = (value) => `$ ${Number(value || 0).toLocaleString('es-CO')}`;






  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Elimina tildes
  };





  const onSubmit = (formData) => {
    const { service_type_id , name} = getValues();

    const normalizedName = normalizeString(name);
    const hasDuplicate = data.some((row) => normalizeString(row.name) === normalizedName);


    console.log(hasDuplicate, "hasDuplicate")


    if (hasDuplicate) {

      setError('name', {
        type: 'manual',
        message: 'El nombre ya existe.',
      });
      return; // Detener la ejecución
    }

    if (service_type_id !== 1) {
      formData = {
        ...formData,
        unit_cost_value: null,
        unit_sales_value: null,
        authorized: null,
      };
    }




    console.log(formData, 'data');
    onSubmitData(formData); // Llamar a la función con los valores ajustados
  };









  console.log(errors, 'errroees');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container fluid className="container-form-master-services">
        <Row>
          <Col>
            <div className="title-activate">{title}</div>

            <TextField
              label="Nombre"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal" error={!!errors.service_type_id}>
              <InputLabel id="type-service">Tipo de Servicio</InputLabel>
              <Controller
                name="service_type_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="type-service"
                    label="Tipo de Servicio"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convertir a número
                  >
                    {typeServiceId.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.type}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.service_type_id?.message}</FormHelperText>
            </FormControl>

            <TextField
              label="Cantidad"
              type="number"
              {...register('quantity', { setValueAs: (v) => (v === '' ? undefined : Number(v)) })}
              error={!!errors.quantity}
              helperText={!!errors.quantity && 'Ingresa un número mayor a 0'}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal" error={!!errors.unit_measure}>
              <InputLabel>Unidad de medida</InputLabel>
              <Select {...register('unit_measure')} label="Unidad de medida">
                <MenuItem value="gr">Gramo</MenuItem>
                <MenuItem value="Kg">Kilogramo</MenuItem>
                <MenuItem value="Tn">Tonelada</MenuItem>
              </Select>
              <FormHelperText>{!!errors.unit_measure && 'Selecciona una opción'}</FormHelperText>
            </FormControl>

            {serviceType === 1 && (
              <>
                <Controller
                  name="unit_cost_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor costo unitario"
                      type="text"
                      fullWidth
                      margin="normal"
                      error={!!errors.unit_cost_value}
                      helperText={!!errors.unit_cost_value && 'Ingresa un número mayor a 0'}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(numericValue ? Number(numericValue) : 0);
                      }}
                      value={formatCurrency(field.value)}
                    />
                  )}
                />

                <Controller
                  name="unit_sales_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Valor venta Unitario"
                      type="text"
                      fullWidth
                      margin="normal"
                      error={!!errors.unit_sales_value}
                      helperText={!!errors.unit_sales_value && 'Ingresa un número mayor a 0'}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(numericValue ? Number(numericValue) : 0);
                      }}
                      value={formatCurrency(field.value)}
                    />
                  )}
                />

                <FormControl fullWidth margin="normal" error={!!errors.authorized}>
                  <InputLabel>Autorizado</InputLabel>
                  <Controller
                    name="authorized"
                    control={control}
                    defaultValue={true} // Asegura que inicie con un booleano
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === 'true')} // Convierte a booleano
                        value={field.value.toString()} // Convierte booleano a string para Select
                        label="Autorizado"
                      >
                        <MenuItem value="true">Sí</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>{!!errors.authorized && 'Por favor autoriza el servicio'}</FormHelperText>
                </FormControl>
              </>
            )}

            <div className="d-flex justify-content-center">
              <Button type="submit" className="custom-button">
                Guardar
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </form>
  );
};

export default FormDataMasterServices;
