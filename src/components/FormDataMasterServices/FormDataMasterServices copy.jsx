import { Col, Container, Row } from "react-bootstrap";
import { TextField, Button, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import "./FormDataMasterServices.css";

// Esquema de validación con Zod
const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  brands: z.array(
    z.object({
      brand: z.string().min(1, "La marca es obligatoria"),
      models: z.array(z.string().min(1, "El modelo no puede estar vacío")),
    })
  ).min(1, "Debe haber al menos una marca"),
});

const FormDataMasterServices = ({ title, dataSubmit, infoRow }) => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      brands: [{ brand: "", models: [""] }],
    },
  });

  // Manejo dinámico de marcas y modelos
  const { fields: brands, append, remove } = useFieldArray({
    control,
    name: "brands",
  });

  // Manejo dinámico de modelos dentro de cada marca
  const addModel = (brandIndex) => {
    const newModels = [...watch(`brands.${brandIndex}.models`), ""];
    setValue(`brands.${brandIndex}.models`, newModels);
  };

  const removeModel = (brandIndex, modelIndex) => {
    const models = watch(`brands.${brandIndex}.models`);
    if (models.length > 1) {
      models.splice(modelIndex, 1);
      setValue(`brands.${brandIndex}.models`, [...models]);
    }
  };

  // Rellenar valores si infoRow tiene datos
  useEffect(() => {
    if (Object.keys(infoRow).length === 0) return;
    Object.entries(infoRow).forEach(([key, value]) => {
      setValue(key, value || (typeof value === "number" ? 0 : ""));
    });
  }, [infoRow, setValue]);

  const onSubmit = async (formData) => {
    try {
   
      console.log("Producto creado:", formData);
      /* dataSubmit(data); */
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container fluid className="container-form-master-services">
        <Row>
          <Col>
            <div className="title-activate">{title}</div>

            {/* Campo Nombre */}
            <TextField
              label="Nombre"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              margin="normal"
            />

            {/* Sección de Marcas y Modelos */}
            <div>
              {brands.map((brand, brandIndex) => (
                <div key={brand.id} className="mb-3">
                  {/* Marca */}
                  <TextField
                    label="Marca"
                    {...register(`brands.${brandIndex}.brand`)}
                    error={!!errors.brands?.[brandIndex]?.brand}
                    helperText={errors.brands?.[brandIndex]?.brand?.message}
                    fullWidth
                    margin="normal"
                  />

                  {/* Modelos */}
                  {watch(`brands.${brandIndex}.models`).map((_, modelIndex) => (
                    <div key={modelIndex} className="d-flex align-items-center">
                      <TextField
                        label="Modelo"
                        {...register(`brands.${brandIndex}.models.${modelIndex}`)}
                        error={!!errors.brands?.[brandIndex]?.models?.[modelIndex]}
                        helperText={errors.brands?.[brandIndex]?.models?.[modelIndex]?.message}
                        fullWidth
                        margin="normal"
                      />
                      <IconButton onClick={() => removeModel(brandIndex, modelIndex)}>
                        <Delete />
                      </IconButton>
                    </div>
                  ))}

                  {/* Botón para agregar modelo */}
                  <Button onClick={() => addModel(brandIndex)} startIcon={<Add />} variant="outlined">
                    Agregar modelo
                  </Button>

                  {/* Botón para eliminar marca */}
                  <IconButton onClick={() => remove(brandIndex)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>

            {/* Botón para agregar nueva marca */}
            <Button onClick={() => append({ brand: "", models: [""] })} startIcon={<Add />} variant="contained">
              Agregar marca
            </Button>

            {/* Botón para enviar formulario */}
            <div className="d-flex justify-content-center mt-3">
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
