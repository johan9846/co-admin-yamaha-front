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
  Checkbox,
} from "@mui/material";
import { Add, Delete, EditOutlined, SearchOutlined } from "@mui/icons-material";

import PanelFix from "../../components/panelFix/PanelFix";
import {
  getAllProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../services/admin.services";

import "./Product.css";
import FormDataMasterServices from "../../components/FormDataMasterServices/FormDataMasterServices";

const Product = () => {
  const CLOUDINARY_UPLOAD_PRESET = "store-yamaha";
  const CLOUDINARY_CLOUD_NAME = "dsd0w2l0x";

  const [dataTable, setDataTable] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [openPanel, setOpenPanel] = useState(false);
  const [editId, setEditId] = useState("");
  const [infoRow, setInfoRow] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const [selectedIds, setSelectedIds] = useState([]);
  const ITEMS_PERPAGE = 10;

  const getProduct = useCallback(async () => {
    try {
      const { data } = await getAllProduct();
      if (data) {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDataTable(sortedData);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
    }
  }, []); // Dependencias necesarias

  const getCategories = useCallback(async () => {
    try {
      const { data } = await getAllCategories();

      if (data) {
        const sortedData = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter((category) => category.status === "Activo");
        setDataCategories(sortedData);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
    }
  }, []); // Dependencias necesarias

  useEffect(() => {
    getProduct();
    getCategories();
  }, [getProduct, getCategories]);

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

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id) // Quitar si ya está
        : [...prevSelected, id]
    );
  };

  console.log(selectedIds, "selectedIds");
  const handleDeleteItem = async () => {
    if (selectedIds.length === 0) {
      console.warn("No products selected for deletion");
      return;
    }

    try {
      const response = await deleteProduct(selectedIds);

      if (response.status === 200) {
        setOpenPanel(false); // Cierra el panel
        await getProduct(); // Recarga la lista de productos
        setSelectedIds([]); // Limpia los IDs seleccionados
      } else {
        console.warn("No products found to delete");
      }
    } catch (error) {
      console.error(
        "Error deleting products:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleOnSubmit = async (data) => {
    if (editId) {
      try {
        const updateProduc = await updateProduct(editId, data);
        if (updateProduc.status === 200) {
          setOpenPanel(false);
          await getProduct();
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
        const newProduct = await addProduct(data);
        if (newProduct.status === 200) {
          setOpenPanel(false);
          await getProduct();
        } else {
          console.log("Not found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setEditId("");
        /*  setOpenPanel(false); */
      }
    }
  };

  const handleEditClick = (row) => {
    setOpenPanel(true);
    setEditId(row.id);
    setInfoRow(row);
  };

  const formatCurrency = (value) =>
    `$ ${Number(value || 0).toLocaleString("es-CO")}`;

  return (
    <div className="container-product mt-4">
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
            setInfoRow({});
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

        <Button
          variant="contained"
          endIcon={<Delete sx={{ color: "#0832DE" }} />}
          onClick={handleDeleteItem}
          disabled={selectedIds.length === 0}
          sx={{
            backgroundColor: "#F6F6F6",
            color: "#000",
            "&:hover": {
              backgroundColor: "#E0E0E0",
            },
            textTransform: "none",
          }}
        >
          Eliminar
        </Button>
      </div>

      <PanelFix
        isOpen={openPanel}
        onClose={() => {
          setOpenPanel(false);
          setEditId("");
        }}
      >
        <div>
          <FormDataMasterServices
            options={dataCategories}
            title={editId ? "Editar Producto" : "Agregar Producto"}
            infoRow={infoRow}
            dataSubmit={handleOnSubmit}
          />
        </div>
      </PanelFix>

      <TableContainer
        component={Paper}
        sx={{ mt: 3 }}
        className="table-container"
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>S</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Cantidad(stock)</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Precio Old</TableCell>
              <TableCell>Precio New</TableCell>
              <TableCell>Puntuación</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="table-body">
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.quantity_stock}</TableCell>
                <TableCell>{row.category.name}</TableCell>
                <TableCell>{formatCurrency(row.oldPrice)}</TableCell>
                <TableCell>{formatCurrency(row.price)}</TableCell>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.image}</TableCell>
                <TableCell>{row.description}</TableCell>
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

export default Product;
