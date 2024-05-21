import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Button,
    Card,
    CardHeader,
    Divider,
    CardContent,
    TextField,
    Alert,
    OutlinedInput,
    Checkbox,
    Typography,
    Accordion,
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    AccordionSummary,
    AccordionDetails,
    ListItemText,
    Breadcrumbs
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useGet, usePost, usePut} from "../../API/request";
import {BallTriangle} from "react-loader-spinner";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import '../../styles/Avatar/style.css'
import { set } from 'lodash';

const PriceDownload = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();

    const [isLoaded, setIsLoaded] = useState(true);
    const [errors, setErrors] = useState({
        city_id: false,
    });

    // состояния сворачивания/разворачивания блоков
    const [expanded, setExpanded] = useState({
        deletePrice: false,
        updatePrice: false,
        addedPrice: false,
      });

    const [cities, setCities ] = useState([])
    const [choosenCities, setChoosenCities] = useState('')
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [deletePrice, setDeletePrice ] = useState([]);
    const [updatePrice, setUpdatePrice ] = useState([]);
    const [addedPrice, setAddedPrice ] = useState([]);
    const [selectedCityFind, setSelectedCityFind] = useState('')
    const [findCity, setFindCity] = useState('')

    const [alert, setAlert] = useState({
        txt: '',
        value: 0,
        type: 'error'
    });

    const showAlert = (type, text, value) => {
        setAlert({
            txt: text,
            type,
            value,
        });

        setTimeout(() => {
            setAlert({
                txt: text,
                type,
                value: 0,
            });

            setSubmitDisabled(false);
        }, 1400);
    };

    const handleChange = (block) => {
        setExpanded((prevExpanded) => ({
          ...prevExpanded,
          [block]: !prevExpanded[block],
        }));
      };

    const handleChangeCity = (event) => {
        const value = event.target.value;
        setChoosenCities(value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        }
      };

    const validate = () => {
        let validComplete = true;
        let formErrors = {...errors};

        if (choosenCities === '') {
            validComplete = false;
            formErrors.city_id = false;
            showAlert('error', "Выберите город", 2)
        }

        setErrors(formErrors);
        return validComplete;
    };

    const submit = async () => {
        if (validate()) {
            setIsLoaded(true)
            setSubmitDisabled(true);

            const formData = new FormData();
            formData.append('file', selectedFile);

            postU(`price/load/discounts?city_id=${choosenCities}`, formData)
                .then((resp) => {
                    if (resp.status === 'success') {
                        setDeletePrice(resp.data.result.delete_price);
                        setUpdatePrice(resp.data.result.update_price);
                        setAddedPrice(resp.data.result.added_price)
                        setFindCity(selectedCityFind)
                    } else {
                        showAlert('error', 'Ошибка', 2);
                    }
                })
                .catch((err) => {
                    console.log(`Ошибка: ${err}`)
                    showAlert('error', 'Ошибка сервера', 2);
                    setSubmitDisabled(false);
                })
                .finally(() => {
                    setIsLoaded(false)
                });
        }
    };

    useEffect(() => {
        setIsLoaded(true)
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch(() => {
                showAlert('error', 'Произошла ошибка при загрузке городов, попробуйте перезайти', 1);
            })
            .finally(() => {
                setIsLoaded(false)
            });
    }, []);

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
                <title>Загрузка прайса</title>
            </Helmet>
            <Box sx={{pt: 2}}>
                <Container maxWidth={false}>
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                        <Link underline="hover" color="inherit" to="/app/price-sections">
                            Разделы
                        </Link>
                            <p>Загрузка прайса</p>
                    </Breadcrumbs>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{mb: 1}}>
                        <Alert severity={alert.type} style={{display: alert.value === 1 ? 'flex' : 'none'}}>
                            {alert.txt}
                        </Alert>
                    </Box>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                    </Box>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%'}}>
                <Container maxWidth={false}>
                    <Box sx={{pt: 2}}>
                        <form>
                            <Card>
                                <CardHeader
                                    title="Загрузка прайса"
                                />
                                <Divider/>
                                <CardContent sx={{position: 'relative'}}>
                                    <FormControl fullWidth sx={{mt: 2, mb: 1}}>
                                        <InputLabel id="Выберите город">
                                            Выберите город
                                        </InputLabel>
                                        <Select
                                            label="Выберите город"
                                            name="city_id"
                                            value={choosenCities}
                                            onChange={handleChangeCity}
                                            input={<OutlinedInput label="Выберите город" />}
                                            renderValue={(selected) => {
                                            if (selected === '---') {
                                                return 'Выберите город';
                                            }
                                            const selectedCity = cities.find(city => city.id === selected);
                                            setSelectedCityFind(selectedCity.name)
                                            return selectedCity ? selectedCity.name : '';
                                            }}
                                        >
                                            <MenuItem value={''}>
                                                <ListItemText primary="Выберите город" />
                                            </MenuItem>
                                            {cities?.map((city) => (
                                            <MenuItem key={city.id} value={city.id}>
                                                <ListItemText primary={city.name} />
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            id="file-input"
                                        />
                                        <label htmlFor="file-input">
                                            <Button component="span" color="primary" variant="contained">
                                                Выбрать файл
                                            </Button>
                                        </label>

                                        {selectedFileName && (
                                            <Typography variant="body1" sx={{ ml: 10 }}>Выбран файл: {selectedFileName}</Typography>
                                        )}

                                        {selectedFileName && (
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={submit}
                                                style={{ marginLeft: 'auto' }}
                                                >
                                                Загрузить
                                            </Button>
                                        )}
                                    </Box>
                                    {/* Вывод заголовка */}
                                    {submitDisabled && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 3, justifyContent: 'center'}}>
                                            <h3>{`Результат загрузки прайса в городе ${findCity}`}</h3>
                                        </Box>
                                    )}

                                    {/* Вывод данных для удаленных категорий */}
                                    {submitDisabled && (
                                        <Accordion sx={{mt: 1}} expanded={expanded.deletePrice} onChange={() => handleChange('deletePrice')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Удаленные категории</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {deletePrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ID</TableCell>
                                                            <TableCell sx={{maxWidth: '800px'}}>Название категории</TableCell>
                                                            <TableCell>Продолжительность</TableCell>
                                                            <TableCell>Цена</TableCell>
                                                        </TableRow>
                                                        </TableHead>
                                                    <TableBody>
                                                        {deletePrice.map((category) => (
                                                        <TableRow key={category.id}>
                                                            <TableCell>{category.id || '---'}</TableCell>
                                                            <TableCell sx={{maxWidth: '800px', wordWrap: 'break-word'}}>
                                                                {category.title.replace(/ /g, '\u00A0') || '---'}
                                                            </TableCell>
                                                            <TableCell>{category.duration || '---'}</TableCell>
                                                            <TableCell>{category.cost || '---'}</TableCell>
                                                        </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    {/* Вывод данных для обновленных категорий */}
                                    {submitDisabled && (
                                        <Accordion sx={{mt: 1}} expanded={expanded.updatePrice} onChange={() => handleChange('updatePrice')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Обновленные категории</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {updatePrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ID</TableCell>
                                                            <TableCell sx={{maxWidth: '800px'}}>Название категории</TableCell>
                                                            <TableCell>Продолжительность</TableCell>
                                                            <TableCell>Цена</TableCell>
                                                        </TableRow>
                                                        </TableHead>
                                                    <TableBody>
                                                        {updatePrice.map((category) => (
                                                        <TableRow key={category.id}>
                                                            <TableCell>{category.id || '---'}</TableCell>
                                                            <TableCell sx={{maxWidth: '800px', wordWrap: 'break-word'}}>
                                                                {category.title.replace(/ /g, '\u00A0') || '---'}
                                                            </TableCell>
                                                            <TableCell>{category.duration || '---'}</TableCell>
                                                            <TableCell>{category.cost || '---'}</TableCell>
                                                        </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    {/* Вывод данных для добавленных категорий */}
                                    {submitDisabled && (
                                        <Accordion sx={{mt: 1}} expanded={expanded.addedPrice} onChange={() => handleChange('addedPrice')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Добавленые категории</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {addedPrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{maxWidth: '800px'}} >Название категории</TableCell>
                                                            <TableCell>Продолжительность</TableCell>
                                                            <TableCell>Цена</TableCell>
                                                        </TableRow>
                                                        </TableHead>
                                                    <TableBody>
                                                        {addedPrice.map((category) => (
                                                        <TableRow key={category.title.replace(/ /g, '\u00A0')}>
                                                            <TableCell sx={{maxWidth: '800px', wordWrap: 'break-word'}}>
                                                                {category.title.replace(/ /g, '\u00A0') || '---'}
                                                            </TableCell>
                                                            <TableCell>{category.duration || '---'}</TableCell>
                                                            <TableCell>{category.cost || '---'}</TableCell>
                                                        </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    <Alert severity={alert.type}
                                           style={{display: alert.value === 2 ? 'flex' : 'none'}}>
                                        {alert.txt}
                                    </Alert>
                                </CardContent>
                                <Divider/>
                            </Card>
                        </form>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default PriceDownload;
