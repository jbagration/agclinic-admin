import { Avatar, Box, Button, Collapse, Divider, IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from "react-feather";
import { useGet, usePut } from "../../API/request";
import { useEffect } from "react";
export const BeforeAfterRow = ({row, showAlert}) => {
    const [open, setOpen] = useState(false);
    const [uploadedBefore, setUploadedBefore] = useState('')
    const [uploadedAfter, setUploadedAfter] = useState('')
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [nothingChanged, setNothingChanged] = useState(true);
    const [values, setValues] = useState("")
    const putU = usePut()
    useEffect(() => {
        const before_img = row.before_img
            ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.before_img}`
            : ''
        const after_img = row.after_img
        ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.after_img}`
        : ''
        setUploadedBefore(before_img)
        setUploadedAfter(after_img)
    }, [])
    const submitBefore = () => {
        if (nothingChanged) {
            showAlert(5, 'error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);
        let data = new FormData();
        data.append('img', values.before_img);
        putU(`specialist/before_after/before/${row.id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(5, 'success', 'Данные успешно обновленны');
                } else {
                    showAlert(5, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(5, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
    }
    const submitAfter = () => {
        if (nothingChanged) {
            showAlert(5, 'error', 'Нет изменений');
            return;
        }
        setSubmitDisabled(true);
        let data = new FormData();
        data.append('img', values.after_img);
        putU(`specialist/before_after/after/${row.id}`, data)
            .then((resp) => {
                if (resp.status === 'success') {
                    showAlert(5, 'success', 'Данные успешно обновленны');
                } else {
                    showAlert(5, 'error', 'Ошибка');
                }
            })
            .catch((err) => {
                showAlert(5, 'error', 'Ошибка сервера');
            })
            .finally(() => {
                setSubmitDisabled(false);
            })
    }
    const beforeImgUploaded = (event) => {
        setNothingChanged(false)
        setUploadedBefore(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            before_img: event.target.files[0]
        });
    };
    const afterImgUploaded = (event) => {
        setNothingChanged(false)
        setUploadedAfter(URL.createObjectURL(event.target.files[0]));
        setValues({
            ...values,
            after_img: event.target.files[0]
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
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Avatar
                    src={
                        row.before_img
                            ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.before_img}`
                            : ''
                    }
                />
            </Box>
        </TableCell>
        <TableCell>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Avatar
                    src={
                        row.after_img
                            ? `${process.env.REACT_APP_API_URL}public/uploads/images/${row.after_img}`
                            : ''
                    }
                />
            </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Редактирование фотографий
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                <div className="itemWrapper">
                    Фото до
                    <div className="container">
                        <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                id={3}
                                onChange={(event) => beforeImgUploaded(event, 1)}/>
                        <label htmlFor={3}>
                            <img src={uploadedBefore} className="beforeAfterImg"/>
                            <div className="middle"/>
                        </label>
                    </div>
                    <div className="help-text">
                        Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                    </div>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={submitBefore}
                        disabled={submitDisabled}
                    >
                        Сохранить
                    </Button>
                </div>
                <div className="itemWrapper">
                    Фото после
                    <div className="container">
                        <input accept="xlsx/*" type="file" style={{display: 'none'}}
                                id={4}
                                onChange={(event) => afterImgUploaded(event, 1)}/>
                        <label htmlFor={4}>
                            <img src={uploadedAfter} className="beforeAfterImg"/>
                            <div className="middle"/>
                        </label>
                    </div>
                    <div className="help-text">
                        Доступны следующие расширения: .png .jpg .svg .bmp .tga .webp
                    </div>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={submitAfter}
                        disabled={submitDisabled}
                    >
                        Сохранить
                    </Button>
                </div>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>)
}