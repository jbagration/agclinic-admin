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

const PriceСomparison = () => {

    const navigate = useNavigate();
    const postU = usePost();
    const getU = useGet();

    const [isLoaded, setIsLoaded] = useState(true);
    const [errors, setErrors] = useState({
        city_id: false,
    });

    // состояния сворачивания/разворачивания блоков
    const [expanded, setExpanded] = useState({
        unique_category: false,
        unique_price: false,
        nounique_price: false,
        unique_notes: false,
      });

    const [cities, setCities ] = useState([])
    const [choosenCities, setChoosenCities] = useState('')
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [uniqueCategory, setUniqueCategory ] = useState([]);
    const [uniquePrice, setUniquePrice ] = useState([]);
    const [nouniquePrice, setNouniquePrice ] = useState([]);
    const [uniqueNotes, setUniqueNotes ] = useState([]);
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
          // Другая логика обработки файла...
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

            postU(`price/load?city_id=${choosenCities}`, formData)
                .then((resp) => {
                    if (resp.status === 'success') {
                        setUniqueCategory(resp.data.result.unique_category);
                        setUniquePrice(resp.data.result.unique_price);
                        setNouniquePrice(resp.data.result.nounique_price)
                        setUniqueNotes(resp.data.result.unique_notes)
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
                <title>Сверка прайса</title>
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
                            <p>Сверка прайса</p>
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
                                    title="Сверка прайса"
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
                                                Поиск
                                            </Button>
                                        )}
                                    </Box>
                                    {/* Вывод заголовка */}
                                    {submitDisabled && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 3, justifyContent: 'center'}}>
                                            <h3>{`Результат поиска в городе ${findCity}`}</h3>
                                        </Box>
                                    )}
                                    {/* Вывод данных для недостающих категорий */}
                                    {submitDisabled && (
                                        <Accordion sx={{mt: 1}} expanded={expanded.unique_category} onChange={() => handleChange('unique_category')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Недостающие категории</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {uniqueCategory.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Название категории</TableCell>
                                                        </TableRow>
                                                        </TableHead>
                                                    <TableBody>
                                                        {uniqueCategory.map((category) => (
                                                        <TableRow key={category.id}>
                                                            <TableCell>{category.name.replace(/ /g, '\u00A0')}</TableCell>
                                                        </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    {/* Вывод данных для недостающего прайса */}
                                    {submitDisabled && (
                                        <Accordion expanded={expanded.unique_price} onChange={() => handleChange('unique_price')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Недостающий прайс</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {uniquePrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Название</TableCell>
                                                            <TableCell>Цена</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                    {uniquePrice.map((price) => (
                                                        <TableRow key={price.id}>
                                                            <TableCell>
                                                                {price.name.replace(/ /g, '\u00A0')}
                                                            </TableCell>
                                                            <TableCell>{price.price}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    {/* Вывод данных для прайса с различиями */}
                                    {submitDisabled && (
                                        <Accordion expanded={expanded.nounique_price} onChange={() => handleChange('nounique_price')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Прайс с различиями в файле</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {nouniquePrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableCell>Название категории</TableCell>
                                                        <TableCell>
                                                            <Table>
                                                                <TableRow>
                                                                    <TableCell sx={{ width: '250px' }} style={{borderBottom: 'none' }}></TableCell>
                                                                    <TableCell style={{ position: 'sticky', top: '0', borderBottom: 'none' }}>Данные на сайте</TableCell>
                                                                    <TableCell style={{ position: 'sticky', top: '0', borderBottom: 'none' }}>Данные в файле</TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableCell>
                                                    </TableHead>
                                                    <TableBody>
                                                        {nouniquePrice.map((price) => (
                                                        <TableRow key={price.id}>
                                                            <TableCell>{price.category_name.replace(/ /g, '\u00A0')}</TableCell>
                                                            <TableCell>
                                                                <Table>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '250px', fontWeight: 'bold' }}>Название прайса:</TableCell>
                                                                            <TableCell>{price.current.name || '---'}</TableCell>
                                                                            <TableCell>{price.inFile.name || '---'}</TableCell>
                                                                        </TableRow>
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '250px', fontWeight: 'bold' }}>Цена:</TableCell>
                                                                            <TableCell>{price.current.cost || '---'}</TableCell>
                                                                            <TableCell>{price.inFile.cost || '---'}</TableCell>
                                                                        </TableRow>
                                                                        <TableRow>
                                                                            <TableCell sx={{ width: '250px', fontWeight: 'bold' }}>Стоимость со скидкой:</TableCell>
                                                                            <TableCell>{price.current.discount_cost || '---'}</TableCell>
                                                                            <TableCell>{price.inFile.discount_cost || '---'}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableCell>
                                                        </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                            </AccordionDetails>
                                        </Accordion>
                                    )}
                                    {/* Вывод данных для недостающих заметок */}
                                    {submitDisabled && (
                                        <Accordion expanded={expanded.unique_notes} onChange={() => handleChange('unique_notes')}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography>Недостающие заметки</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            {uniquePrice.length === 0 ? (
                                                <Typography>Ничего не найдено</Typography>
                                            ) : (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Название категории</TableCell>
                                                            <TableCell>Сообщение</TableCell>
                                                            <TableCell>Заметки</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {uniqueNotes.map((note) => (
                                                        <TableRow key={note.id}>
                                                            <TableCell>{note.category_name.replace(/ /g, '\u00A0')}</TableCell>
                                                            <TableCell>{note.message.replace(/ /g, '\u00A0')}</TableCell>
                                                            <TableCell>{note.notes.replace(/ /g, '\u00A0')}</TableCell>
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

export default PriceСomparison;
