import { Paper } from "@mui/material";
import { PriceSectionRow } from "./PriceSectionRow"
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
import { useGet } from "../../API/request";
import { Link } from "react-router-dom";

export const PriceChildrenSection = ({id, allSections, cnt, loadSection, showAlert, limit, page, handleChangeLimit, handleChangePage}) => {
    const getU = useGet()
    const [categories, setCategories] = useState([])
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (id)
            getU(`price/category/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category)
                    setCount(resp.data.category.length)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        else {
            setCategories(allSections)
            setCount(cnt)
        }
    }, [])

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            {id && <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px'}}>
                <Box sx={{marginLeft: 2}}>
                    <Link to={`/app/price-category/add/${id}`}>
                        <Button color="primary" variant="contained">
                            Добавить категорию в раздел
                        </Button>
                    </Link>
                </Box>
            </Box>}
            {categories?.length ?
            <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{width: 80}}>
                        Категории
                    </TableCell>
                    <TableCell sx={{width: 80}}>
                        Id
                    </TableCell>
                    <TableCell>
                        Название раздела
                    </TableCell>
                    <TableCell>
                        Дата создания
                    </TableCell>
                    <TableCell>
                        Дата обновления
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Link
                                to={`/app/price/download`}>
                                <Button color="info"
                                        variant="contained"
                                        sx={{mr: 3}}
                                >
                                    Загрузить прайс
                                </Button>
                            </Link>
                            <Link
                                to={`/app/price/price-comparison`}>
                                <Button color="secondary"
                                        variant="contained"
                                >
                                    Сверка прайса
                                </Button>
                            </Link>
                        </Box>
                    </TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((row) => (
                        <PriceSectionRow key={row.id} row={row} showAlert={showAlert} loadSection={loadSection} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            labelRowsPerPage={
                                <span>Кол-во строк на странице:</span>}
                            rowsPerPageOptions={[10, 20, 30, 40, 50]}
                            colSpan={6}
                            count={count}
                            rowsPerPage={limit}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeLimit}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
            :
            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                <Typography>
                    Нет вложенных категорий
                </Typography>
            </TableCell>}
        </Box>
    )
}