import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Avatar,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TableFooter,
    TablePagination,
    TextField,
    Divider, Alert
} from '@material-ui/core';
import {BallTriangle} from "react-loader-spinner";
import "../../../styles/UpdateSystem/settings.scss"
import {useGet, usePost, usePut} from "../../../API/request";

const MAX_COUNT = 1;

const UpdateSystem = () => {

    const getU = useGet();
    const postU = usePost();
    const putU = usePut();

    const [isLoaded, setIsLoaded] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [uploadedImportFiles, setUploadedImportFiles] = useState([])
    const [uploadedExportFiles, setUploadedExportFiles] = useState([])
    const [fileLimit, setFileLimit] = useState(false);

    const [alert, setAlert] = useState({
        txt: '',
        isVisible: false,
        type: 'error'
    });

    const showAlert = (type, text) => {
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

        }, 3000);
    };


    const hiddenExportFileInput = React.useRef(null);
    const hiddenImportFileInput = React.useRef(null);

    const handleExportClick = (event) => {
        hiddenExportFileInput.current.click();
    };
    const handleImportClick = (event) => {
        hiddenImportFileInput.current.click();
    };

    const handleExportUploadFiles = files => {
        const uploaded = [...uploadedExportFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    showAlert('error', `Максималньое количество файлов для выбора: ${MAX_COUNT}`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedExportFiles(uploaded)

    }
    const handleImportUploadFiles = files => {
        const uploaded = [...uploadedImportFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    showAlert('error', `Максималньое количество файлов для выбора: ${MAX_COUNT}`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedImportFiles(uploaded)

    }

    const handleExportFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleExportUploadFiles(chosenFiles);
    }
    const handleImportFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleImportUploadFiles(chosenFiles);
    }

    const deleteExportElement = async (index) => {
        let newVar = await uploadedExportFiles.filter((item, i) => i !== index);
        await setUploadedExportFiles(newVar)
    }
    const deleteImportElement = async (index) => {
        let newVar = await uploadedImportFiles.filter((item, i) => i !== index);
        await setUploadedImportFiles(newVar)
    }
    const clearExportElement = async (index) => {
        await setUploadedExportFiles([])
    }
    const clearImportElement = async (index) => {
        await setUploadedImportFiles([])
    }

    const save = () => {

        let data = new FormData();
        data.append('backend', uploadedImportFiles[0]);


        putU('system/backend/import', data)
            .then((response) => {
                if (response.status === "success") {
                    showAlert('success', "Вы успешно обновили файл")
                    loadExport();
                }
            })
            .catch((e) => {
                showAlert('error', e.response.data.message)

            })
            .finally(() => {

            })
    }

    const loadExport = () => {
        setIsLoaded(true)

        getU('system/backend/export')
            .then((response) => {
                if (response.status === "success") {
                    setUploadedExportFiles([response.data.backend])
                    console.log(response.data.backend)
                }
            })
            .catch((e) => {
                showAlert('error', e.response.data.message)
            })
            .finally(() => {
                setIsLoaded(false)
            })
    }

    useEffect(() => {
        loadExport();
    }, [])

    if (isLoaded) {
        return (
            <div className="loader">
                <BallTriangle
                    height="100"
                    width="100"
                    color='grey'
                    ariaLabel='loading'
                />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Обновление системы</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Обновление системы
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '90%', py: 3}}>
                <Container maxWidth={false}>

                    <Alert severity={alert.type} style={{display: alert.isVisible ? 'flex' : 'none'}}>
                        {alert.txt}
                    </Alert>
                    <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <a href={`${process.env.REACT_APP_API_URL}uploads/backend/${uploadedExportFiles[0]}`}>
                            <Button
                                color="primary"
                                variant="contained"
                                sx={{m: 1, mt: 3}}
                                onClick={loadExport}
                            >
                                Загрузить экспорт
                            </Button>
                        </a>
                    </Box>

                    <Box sx={{pt: 3}}>
                        <div className="update-system-page">
                            <div className="update-system-page__wrapper">
                                <div className="update-system-page__export-block">
                                    <h1>
                                        Импорт
                                    </h1>
                                    <div className="update-system-page__export-block-list">
                                        {uploadedImportFiles?.length > 0
                                            ? (
                                                <div>
                                                    {uploadedImportFiles?.map((file, index) => (
                                                        <div className="update-system-page__export-block-list__item"
                                                             key={index}>
                                                            <div
                                                                className="update-system-page__export-block-list__item-name">
                                                                {index + 1 + ". " + file.name}
                                                            </div>
                                                            <div
                                                                className="update-system-page__export-block-list__item-icon"
                                                                onClick={() => deleteImportElement(index)}>
                                                                <img src={"/static/images/close.svg"}
                                                                     alt="closeIcon"/>
                                                            </div>
                                                        </div>
                                                    ))
                                                    }
                                                </div>
                                            )
                                            : <div className="update-system-page__export-block-list__placeholder">
                                                Тут будут отображаться выбранные вами файлы
                                            </div>
                                        }
                                    </div>
                                    <div className="update-system-page__export-block-buttons">
                                        <input
                                            type="file"
                                            multiple
                                            disabled={fileLimit}
                                            style={{display: 'none'}}
                                            onChange={handleImportFileEvent}
                                            ref={hiddenImportFileInput}/>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            sx={{m: 1, mt: 3}}
                                            onClick={handleImportClick}
                                        >
                                            Выберите файл
                                        </Button>
                                        {uploadedImportFiles?.length <= 0
                                            ? <></>
                                            : <>
                                                <Button
                                                    onClick={save}
                                                    color="primary"
                                                    variant="contained"
                                                    sx={{m: 1, mt: 3}}
                                                >
                                                    Отправить
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    sx={{m: 1, mt: 3}}
                                                    onClick={clearImportElement}
                                                >
                                                    Очистить импорт
                                                </Button>
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default UpdateSystem;
