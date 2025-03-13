import { Col, Container, Row } from "react-bootstrap";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

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
  rating: z
    .number()
    .gt(0, { message: "Ingrese un número mayor a 0" })
    .min(1, { message: "El rating no puede ser menor a 0" })
    .max(5, { message: "El rating no puede ser mayor a 5" }),
  image: z
    .union([
      z.instanceof(File, { message: "Debe subir un archivo válido" }), // Mensaje si no es un archivo válido
      z.string().url("Debe ser una URL válida"), // ✅ Acepta URLs válidas
    ])
    .refine(
      (file) => typeof file === "string" || file.size <= 5 * 1024 * 1024,
      "El archivo no debe exceder los 5MB"
    ),

  description: z.string().min(1, "La descripción es obligatoria"),
});

const FormDataMasterServices = ({ options, title, dataSubmit, infoRow }) => {
  const CLOUDINARY_UPLOAD_PRESET = "store-yamaha";
  const CLOUDINARY_CLOUD_NAME = "dsd0w2l0x";

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
    if (!infoRow) return; // Si infoRow es undefined, no hacer nada

    Object.entries(infoRow).forEach(([key, value]) => {
      setValue(key, value || (typeof value === "number" ? 0 : ""));
    });
  }, [infoRow, setValue]); // 👈 `setValue` ya está memoizado internamente

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url; // URL de la imagen subida
  };

  const onSubmit = async (formData) => {
    try {
      if (formData.image instanceof File) {
        formData.image = await uploadImage(formData.image);
      }
      dataSubmit(formData);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  console.log(errors, "errores");

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
              {...register("quantity_stock", {
                valueAsNumber: true,
              })}
              
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Solo permite números y punto
              }}
              error={!!errors.quantity_stock}
              helperText={!!errors.quantity_stock&&"Ingresa un número mayor a 0"}
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
                valueAsNumber: true,
              })}
              type="number"
              inputProps={{
                step: 1,
                min: 0, // Evita valores negativos
                max: 5,
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Solo permite números y punto
              }}
              error={!!errors.rating}
              helperText={!!errors.rating && "Ingresa un número entre 1 y 5" }
              fullWidth
              margin="normal"
            />

            <Controller
              name="image"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Box>
                  <input
                    accept="image/jpg, image/png, image/jpeg, image/webp"
                    style={{ display: "none" }}
                    id="file-upload"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file); // Actualizar el valor del campo
                    }}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span">
                      Subir imagen
                    </Button>
                  </label>
                  {field.value && (
                    <div>
                      Archivo seleccionado {field.value.name ?? field.value}
                    </div>
                  )}

                  {errors.image && <div style={{fontSize:"12px", color:"#d32f2f" }}>{errors.image.message}</div>}
                </Box>
              )}
            />

            <TextField
              label="description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              multiline
              rows={3}
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
