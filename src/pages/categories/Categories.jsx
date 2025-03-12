import { useCallback, useEffect, useMemo, useState } from "react";

import {
  InputAdornment,
  Pagination,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem,
} from "@mui/material";
import { Add, EditOutlined, SearchOutlined } from "@mui/icons-material";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PanelFix from "../../components/panelFix/PanelFix";
import {
  getAllCategories,
  addCategories,
  updateCategories,
} from "../../services/admin.services";
import "./Categories.css";

const Categories = () => {
  const [dataTable, setDataTable] = useState([]);
  const [openPanel, setOpenPanel] = useState(false);
  const [editId, setEditId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const ITEMS_PERPAGE = 10;

  const categoriesSchema = z.object({
    name: z.string().min(1, "El vehículo es obligatorio"),
    status: z.enum(["Activo", "Inactivo"], {
      required_error: "Selecciona un estado válido",
    }),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",

    resolver: zodResolver(categoriesSchema),
  });

  const getCategories = useCallback(async () => {
    try {
      const { data } = await getAllCategories();

      console.log(data.data);
      if (data) {
        const sortedData = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataTable(sortedData);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
    }
  }, []); // Dependencias necesarias

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const filteredData = useMemo(() => {
    const filtered = dataTable.filter((file) =>
      file.name?.toLowerCase().includes(searchTerm)
    );

    setCurrentPage(1);
    return filtered;
  }, [searchTerm, dataTable]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PERPAGE;
    const endIndex = startIndex + ITEMS_PERPAGE;
    const filterPage = filteredData.slice(startIndex, endIndex);
    return filterPage;
  }, [currentPage, ITEMS_PERPAGE, filteredData]);

  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOnSubmit = async (data) => {
    if (editId) {
      try {
        const updateCategory = await updateCategories(editId, data);
        if (updateCategory.status === 200) {
          setOpenPanel(false);
          await getCategories();
        } else {
          console.log("Not found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setEditId("");
        setOpenPanel(false);
      }
    } else {
      try {
        const newCategorie = await addCategories(data);
        if (newCategorie.status === 200) {
          setOpenPanel(false);
          await getCategories();
        } else {
          console.log("Not found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setEditId("");
        setOpenPanel(false);
      }
    }
  };

  const handleEditClick = (row) => {
    setOpenPanel(true);
    setEditId(row.id);
    setValue("name", row.name);
    setValue("status", row.status);
  };

  return (
    <div className="container-categories mt-4">
      <div className="input-search">
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </div>

      <div className="button-action mt-5">
        <Button
          size="medium"
          className="custom-button"
          variant="contained"
          endIcon={<Add sx={{ color: "#0832DE" }} />}
          onClick={() => {
            setOpenPanel(true);
            setEditId("");
            setValue("name", undefined);
            setValue("status", undefined);
          }}
          sx={{
            backgroundColor: "#F6F6F6",
            color: "#000",
            "&:hover": {
              backgroundColor: "#E0E0E0",
            },
            textTransform: "none",
          }}
        >
          Agregar
        </Button>
      </div>

      <PanelFix
        isOpen={openPanel}
        onClose={() => {
          setOpenPanel(false);
          setEditId("");
        }}
      >
        
         
         <div className="px-4" >
          <div className="title-activate mb-4">{editId ? "Editar categoria" : "Agregar categoria"}</div>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <TextField
            {...register("name")}
            label="Nombre de la categoría"
            fullWidth
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel id="type-service">Estado</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="type-service"
                  label="Estado"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)} // No es necesario convertir a número si es string
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
            
            <div className="d-flex justify-content-center">
          <Button type="submit" variant="contained" sx={{ mt: 2}} className="add-button">
            {editId ? "Actualizar" : "Agregar"}
          </Button></div>
        </form>
        </div>
      </PanelFix>

      <TableContainer component={Paper} sx={{ mt: 3 }} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  {
                    <EditOutlined
                      sx={{ color: "#0832DE", cursor: "pointer" }}
                      onClick={() => handleEditClick(row)}
                    />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination-container mb-3 mt-4">
        <Pagination
          count={Math.ceil(filteredData.length / ITEMS_PERPAGE)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Categories;
