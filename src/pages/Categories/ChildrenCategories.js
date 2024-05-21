import { Paper, TableCell } from "@mui/material";
import { CategoryRow } from "./CategoryRow"
import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardHeader,
    Container,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@material-ui/core";
import { useGet } from "../../API/request";
import { Link } from "react-router-dom";

export const ChildrenCategories = ({id, ctgs, cnt, loadServices, showAlert, limit, page, handleChangeLimit, handleChangePage}) => {

    const getU = useGet()
    const [categories, setCategories] = useState([])
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (id)
            getU(`services_category/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategories(resp.data.category.category)
                    setCount(resp.data.category.category.length)
                }
            })
            .catch(() => {

            })
            .finally(() => {
            });
        else {
            setCategories(ctgs)
            setCount(cnt)
        }
    }, [])

    return(
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>

            {id && <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px'}}>
                <Box sx={{marginLeft: 2}}>
                    <Link to={`/app/categories/add/${id || 0}`}>
                        <Button color="primary" variant="contained">
                            Добавить категорию услуг
                        </Button>
                    </Link>
                </Box>
            </Box>}
            {categories?.length ?
            <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{width: 80}}/>
                    <TableCell sx={{width: 80}}>
                        Id
                    </TableCell>
                    <TableCell sx={{width: 180}}>
                        Avatar
                    </TableCell>
                    <TableCell>
                        Service category name
                    </TableCell>
                    <TableCell />
                </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((row) => (
                        <CategoryRow key={row.id} row={row} showAlert={showAlert} loadServices={loadServices}/>
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
            <Typography>
                Нет вложенных категорий
            </Typography>}
        </Box>

    )
}