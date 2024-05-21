import { Alert, Avatar, Box, Button, Collapse, Divider, IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from "react-feather";
import { useDelete, useGet, usePut } from "../../API/request";
import { useEffect } from "react";
import { PriceChildrenCategories } from "./PriceChildrenCategories";
import { Link } from "react-router-dom";
import { useConfirm } from "../../components/Confirm";

export const PriceSectionRow = ({row, showAlert, loadSection}) => {
    const [open, setOpen] = useState(false);
    const confirm = useConfirm()
    const deleteU = useDelete()

    const formattedDateTime = (createdAt) => {
        if (createdAt === null) {
          return '';
        }
        const dateObj = new Date(createdAt);
        return dateObj.toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

    const onDelete = (id) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить раздел?',
            onConfirm: () => {
                deleteU(`price/section/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadSection();
                            showAlert('success', 'Раздел успешно удалена')
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
            {row.id || '---'}
        </TableCell>
        <TableCell>
            {row.value || '---'}
        </TableCell>
        <TableCell>
            {formattedDateTime(row.date_create) || '---'}
        </TableCell>
        <TableCell>
            {formattedDateTime(row.date_update) || '---'}
        </TableCell>
        <TableCell>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Box sx={{ display: 'flex' }}>
                    <Link to={`info/${row.id}`}>
                        <Button color="primary"
                                variant="contained">
                            Инфо.
                        </Button>
                    </Link>
                    <Box sx={{ml: 2}}>
                        <Link
                            to={`edit/${row.id}`}>
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
                <PriceChildrenCategories id={row.id} row={row.category} showAlert={showAlert} loadSection={loadSection}/>
                <Alert severity={showAlert.type}
                        style={{display: showAlert.isVisible ? 'flex' : 'none'}}>
                    {showAlert.txt}
                </Alert>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>)
}