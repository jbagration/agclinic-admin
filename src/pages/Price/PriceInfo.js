import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Container,
    Avatar,
    Card,
    Table,
    Typography,
    TableBody,
    TableContainer,
    Paper,
    TableCell,
    Breadcrumbs,
    CardContent,
    TableHead,
    TableRow,
    Button,
    TableFooter,
    TablePagination,
    TextField,
    Divider,
    Alert
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {useDelete, useGet, usePut} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";
import {useConfirm} from "../../components/Confirm/index";

const PriceInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const putU = usePut();
    const deleteU = useDelete();
    const {id} = useParams();
    const confirm = useConfirm();

    const [isLoaded, setIsLoaded] = useState(true);

    const [price, setPrice] = useState({});
    const [category, setCategory] = useState([])

    const loadCategory = (category_id) => {
        setIsLoaded(true)
        getU(`price/category/${category_id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategory(resp.data.category)
                }
            })
            .catch((err) => {
                console.log(err)
            } )
            .finally(() => {
                setIsLoaded(false)
            });
    };

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

    const formattedDate = (createdAt) => {
        if (createdAt === null) {
          return '';
        }

        const dateObj = new Date(createdAt);
        return dateObj.toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      };

    const onDelete = (price_id, city_id) => {
        confirm({
            title: 'Удаление',
            content: 'Вы уверены, что хотите удалить скидку?',
            onConfirm: () => {
                deleteU(`price/discount/${price_id}?city_id=${city_id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadPrice();
                        } else {
                            showAlert('error', 'Ошибка', 2);
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    const loadPrice = () => {
        getU(`price/price/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setPrice(resp.data.price)
                    loadCategory(resp.data.price.category_id)
                }
            })
            .catch((err) => {
                console.log(err)
            } )
            .finally(() => {
                setIsLoaded(false)
            });
    }

    useEffect(() => {
        setIsLoaded(true);
        loadPrice();
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
                <title>Информация прайса</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Прайс
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <RouterLink underline="hover" color="inherit" to="/app/price-sections">
                        Разделы
                    </RouterLink>
                    <RouterLink underline="hover" color="inherit" to={`/app/price-sections/category/info/${price.category_id}`}>
                        {category.value || "Категория"}
                    </RouterLink>
                        <p>Информация прайса</p>
                </Breadcrumbs>
            </Box>

            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <div className="wrapAvatar">
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Города:
                                            </div>
                                            <div className="text">
                                                {price?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Название прайса:
                                            </div>
                                            <div className="text">
                                                {price?.title || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Категория:
                                            </div>
                                            <div className="text">
                                                {category?.value || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                ID:
                                            </div>
                                            <div className="text">
                                                {price?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Продолжительность:
                                            </div>
                                            <div className="text">
                                                {price?.duration || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Цена:
                                            </div>
                                            <div className="text">
                                                {price?.cost || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Примечания:
                                            </div>
                                            <div className="text">
                                                {price?.notes || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Дата создания:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(price?.date_create) || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label" style={{ width: '200px' }}>
                                                Дата обновления:
                                            </div>
                                            <div className="text">
                                                {formattedDateTime(price?.date_update) || '---'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                                    {price?.discount.length ?
                                    <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                            <TableCell>Город</TableCell>
                                            <TableCell>Цена с учётом скидки</TableCell>
                                            <TableCell>Окончание скидки</TableCell>
                                            <TableCell>Дата обновления</TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                                    <RouterLink
                                                        to={`/app/price/discount/${price?.id}`}>
                                                        <Button
                                                            color="primary"
                                                            variant="contained"
                                                        >
                                                            Добавить/обновить скидку
                                                        </Button>
                                                    </RouterLink>
                                                </Box>
                                            </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {console.log(price.discount)}
                                            {price?.discount?.map((discountItem, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{price?.city?.find(el => el.id === discountItem?.city_id).name || '---'}</TableCell>
                                                <TableCell>{discountItem?.discount_cost }</TableCell>
                                                <TableCell>{formattedDate(discountItem?.discount_end || '---')}</TableCell>
                                                <TableCell>{formattedDateTime(discountItem?.date_update || '---')}</TableCell>
                                                <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Button
                                                        color="error"
                                                        variant="contained"
                                                        onClick={(e) => e && onDelete(discountItem.price_id, discountItem.city_id)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                    :
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography>
                                                Скидок на данную услугу нет
                                            </Typography>
                                            <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
                                                <RouterLink
                                                    to={`/app/price/discount/${price?.id}`}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                    >
                                                        Добавить/обновить скидку
                                                    </Button>
                                                </RouterLink>
                                            </Box>
                                        </Box>
                                    </TableCell>}
                                </Box>
                                </PerfectScrollbar>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default PriceInfo;
