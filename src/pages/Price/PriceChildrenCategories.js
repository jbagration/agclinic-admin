import { Paper } from "@mui/material";
import { PriceCategoryRow } from "./PriceCategoryRow"
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableFooter,
    TablePagination,
    TableCell,
    TableRow,
    Typography
 } from "@material-ui/core";
import { Link } from "react-router-dom";

export const PriceChildrenCategories = ({id, row, cnt, loadSection, showAlert, limit, page, handleChangeLimit, handleChangePage}) => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        setCategories(row)
    }, [])

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            {categories?.length ?
            <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{width: 80}}>
                        Id
                    </TableCell>
                    <TableCell>
                        Название категории
                    </TableCell>
                    <TableCell>
                        Дата создания
                    </TableCell>
                    <TableCell>
                        Дата обновления
                    </TableCell>
                    <TableCell>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Box sx={{marginLeft: 2}}>
                                <Link to={`/app/price-category/add/${id}`}>
                                    <Button color="success" variant="contained">
                                        Добавить категорию в раздел
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((row) => (
                        <PriceCategoryRow key={row.id} row={row} showAlert={showAlert} loadSection={loadSection} />
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
            :
            <TableCell colSpan={5} align="center">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>
                        Нет вложенных категорий
                    </Typography>
                    <Box sx={{ marginLeft: 2 }}>
                        <Link to={`/app/price-category/add/${id}`}>
                            <Button color="success" variant="contained">
                                Добавить категорию в раздел
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </TableCell>}
        </Box>
    )
}