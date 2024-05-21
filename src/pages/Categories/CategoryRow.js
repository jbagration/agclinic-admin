import { Alert, Avatar, Box, Button, Collapse, Divider, IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from "react-feather";
import { useDelete, useGet, usePut } from "../../API/request";
import { useEffect } from "react";
import { ChildrenCategories } from "./ChildrenCategories";
import { Link } from "react-router-dom";
import { useConfirm } from "../../components/Confirm";

export const CategoryRow = ({row, showAlert, loadServices}) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm()
    const deleteU = useDelete()

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const [nextAlert, setNextAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const showNextAlert = (type, text) => {
        setAlert({
            txt: text,
            type,
            isVisible: true
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                isVisible: false
            });
        }, 1400);
    };

    const onDelete = (id) => {

        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить категорию?',
            onConfirm: () => {
                deleteU(`services_category/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadServices();
                            showAlert('success', 'Категория успешно удалена')
                        }
                    })
                    .catch((e) => {
                        showAlert('error', 'Произошла ошибка')
                    });
            }
        });
    };

    return (<>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell>
            {row.id}
        </TableCell>
        <TableCell>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Avatar
                    src={
                        row.img
                            ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.img}`
                            : ''
                    }
                />
            </Box>
        </TableCell>
        <TableCell component="th" scope="row">
            {row.value}
        </TableCell>
        <TableCell>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

                <Box sx={{ display: 'flex' }}>
                    <Link to={`/app/categories/${row.id}`}>
                        <Button color="primary"
                                variant="contained">
                            Инфо.
                        </Button>
                    </Link>
                    <Box sx={{ml: 2}}>
                        <Link
                            to={`/app/categories/edit/${row.id}`}>
                            <Button color="primary"
                                    variant="contained"
                            >
                                Редакт.
                            </Button>
                        </Link>

                    </Box>
                    <Box sx={{ml: 2}}>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => onDelete(row.id)}
                        >
                            Удалить
                        </Button>

                    </Box>

                </Box>
            </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <ChildrenCategories id={row.id} loadServices={loadServices} showAlert={showNextAlert} limit={limit} page={page}/>
                <Alert severity={nextAlert.type}
                        style={{display: nextAlert.isVisible ? 'flex' : 'none'}}>
                    {nextAlert.txt}
                </Alert>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>)
}