import { Col, Container, Row } from "react-bootstrap";
import { TextField, Select, MenuItem, Button, InputLabel } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, z } from "zod";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useMemo, useState } from "react";
import "./FormDataMasterServices.css";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  brand: z.string().optional(),
  model: z.string().optional(),
  category_id: z.number().gt(0, { message: "Ingrese un número mayor a 0" }),
  quantity_stock: z.number().gt(0, { message: "Ingrese un número mayor a 0" }),
  oldPrice: z.number().gt(0, { message: "Ingrese un número mayor a 0" }),
  price: z.number().gt(0, { message: "Ingrese un número mayor a 0" }),
  rating: z.number().gt(0, { message: "Ingrese un número mayor a 0" }),
  image: z.string().min(1, "La imagen es obligatoria"),
  description: z.string().min(1, "La descripción es obligatoria"),
});

const FormDataMasterServices = ({ options, title, dataSubmit, infoRow }) => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",

    resolver: zodResolver(schema), // Se inicia con un esquema por defecto
  });

  const formatCurrency = (value) =>
    `$ ${Number(value || 0).toLocaleString("es-CO")}`;

  useEffect(() => {
    console.log(infoRow, "infooo");
    if (Object.keys(infoRow).length > 0) {
      setValue("name", infoRow.name || ""); // Asigna el valor de `name` o una cadena vacía si no existe
      setValue("brand", infoRow.brand || ""); // Asigna el valor de `brand` o una cadena vacía si no existe
      setValue("model", infoRow.model || ""); // Asigna el valor de `model` o una cadena vacía si no existe
      setValue("category_id", infoRow.category_id || 0); // Asigna el valor de `category_id` o 0 si no existe
      setValue("quantity_stock", infoRow.quantity_stock || 0); // Asigna el valor de `quantity_stock` o 0 si no existe
      setValue("oldPrice", infoRow.oldPrice || 0); // Asigna el valor de `oldPrice` o 0 si no existe
      setValue("price", infoRow.price || 0); // Asigna el valor de `price` o 0 si no existe
      setValue("rating", infoRow.rating || 0); // Asigna el valor de `rating` o 0 si no existe
      setValue("image", infoRow.image || ""); // Asigna el valor de `image` o una cadena vacía si no existe
      setValue("description", infoRow.description || ""); // Asigna el valor de `description` o una cadena vacía si no existe
    } else {
      setValue("name", undefined); // Asigna el valor de `name` o una cadena vacía si no existe
      setValue("brand", undefined); // Asigna el valor de `brand` o una cadena vacía si no existe
      setValue("model", undefined); // Asigna el valor de `model` o una cadena vacía si no existe
      setValue("category_id", undefined); // Asigna el valor de `category_id` o 0 si no existe
      setValue("quantity_stock", undefined); // Asigna el valor de `quantity_stock` o 0 si no existe
      setValue("oldPrice", undefined); // Asigna el valor de `oldPrice` o 0 si no existe
      setValue("price", undefined); // Asigna el valor de `price` o 0 si no existe
      setValue("rating", undefined); // Asigna el valor de `rating` o 0 si no existe
      setValue("image", undefined); // Asigna el valor de `image` o una cadena vacía si no existe
      setValue("description", undefined); // Asigna el valor de `description` o una cadena vacía si no existe
    }
  }, [infoRow]);

  const onSubmit = (formData) => {
    dataSubmit(formData);
  };

  console.log(errors, "errroees");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container fluid className="container-form-master-services">
        <Row>
          <Col>
            <div className="title-activate">{title}</div>
            <TextField
              label="Nombre"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Marca"
              {...register("brand")}
              error={!!errors.brand}
              helperText={errors.brand?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Modelo"
              {...register("model")}
              error={!!errors.model}
              helperText={errors.model?.message}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal" error={!!errors.category_id}>
              <InputLabel>Categoria</InputLabel>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Categoria"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {options.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {!!errors.category_id && "Selecciona una opción"}
              </FormHelperText>
            </FormControl>
            <TextField
              label="Cantidad"
              type="number"
              {...register("quantity_stock", {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
              error={!!errors.quantity_stock}
              helperText={
                !!errors.quantity_stock && "Ingresa un número mayor a 0"
              }
              fullWidth
              margin="normal"
            />
            <Controller
              name="oldPrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor Antiguo"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!errors.oldPrice}
                  helperText={
                    !!errors.oldPrice && "Ingresa un número mayor a 0"
                  }
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(numericValue ? Number(numericValue) : 0);
                  }}
                  value={formatCurrency(field.value)}
                />
              )}
            />
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor nuevo"
                  type="text"
                  fullWidth
                  margin="normal"
                  error={!!errors.price}
                  helperText={!!errors.price && "Ingresa un número mayor a 0"}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(numericValue ? Number(numericValue) : 0);
                  }}
                  value={formatCurrency(field.value)}
                />
              )}
            />
            <TextField
              label="Puntuación"
              {...register("rating", {
                required: "La puntuación es requerida",
                valueAsNumber: true,
              })}
              type="number"
              inputProps={{
                step: "0.1",
                min: 0, // Evita valores negativos
                max: 5,
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Solo permite números y punto
              }}
              error={!!errors.rating}
              helperText={errors.rating?.message}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Imagen"
              {...register("image")}
              error={!!errors.image}
              helperText={errors.image?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              margin="normal"
            />
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
