import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    CardContent,
    Divider,
    Breadcrumbs,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    CardHeader
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {useGet, useDelete} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";

const PriceCategoryInfo = () => {

    const confirm = useConfirm();
    const navigate = useNavigate();
    const getU = useGet();
    const deleteU = useDelete();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);

    const [category, setCategory] = useState({});
    const [cities, setCities ] = useState([])
    const [prices, setPrices] = useState([])


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
            content: 'Вы уверены, что хотите удалить прайс?',
            onConfirm: () => {
                deleteU(`price/price/${id}`)
                    .then((resp) => {
                        if (resp.status === 'success') {
                            loadCategory();
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    });
            }
        });
    };

    const loadCategory = () => {
        setIsLoaded(true)
        getU(`price/category/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCategory(resp.data.category)
                    setPrices(resp.data.category.price)
                }
            })
            .catch((err) => {
                console.log(err)
            } )
            .finally(() => {
                setIsLoaded(false)
            });
    };

    useEffect(() => {
        loadCategory();
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
                <title>Категория</title>
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
                        <p>{category?.value}</p>
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
                                            <div className="label">
                                                ID:
                                            </div>
                                            <div className="text">
                                                {category?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                Категория:
                                            </div>
                                            <div className="text">
                                                {category?.value || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города:
                                            </div>
                                            <div className="text">
                                                {category?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            <Box sx={{backgroundColor: 'background.default', pt: 3}}>
                <Container maxWidth={false}>
                    <Box sx={{
                        paddingBottom: 1
                    }}>
                        <Card>
                        <CardHeader
                            title={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Прайс</Typography>
                                <RouterLink to={`/app/price/add/${id}`}>
                                    <Button color="primary" variant="contained">
                                        Добавить прайс в категорию
                                    </Button>
                                </RouterLink>
                                </Box>
                            }
                        />
                            <Divider/>
                            <CardContent sx={{position: 'relative'}}>
                                { prices?.length?
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{width: 80}}>
                                                Id
                                            </TableCell>
                                            <TableCell>
                                                Название услуги
                                            </TableCell>
                                            <TableCell>
                                                Продожлительность
                                            </TableCell>
                                            <TableCell>
                                                Стоимость
                                            </TableCell>
                                            <TableCell>
                                                Примечания
                                            </TableCell>
                                            <TableCell>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prices?.map((price) => (
                                            <TableRow hover key={price.id}>
                                                <TableCell sx={{width: 80}}>
                                                    {price?.id || '---'}
                                                </TableCell>
                                                <TableCell>
                                                    {price?.title || '---'}
                                                </TableCell>
                                                <TableCell>
                                                    {price?.duration || '---'}
                                                </TableCell>
                                                <TableCell>
                                                    {price?.cost || '---'}
                                                </TableCell>
                                                <TableCell>
                                                    {price?.notes || '---'}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <RouterLink to={`/app/price/info/${price.id}`}>
                                                            <Button color="primary" variant="contained">
                                                                Инфо.
                                                            </Button>
                                                        </RouterLink>
                                                        <Box sx={{ ml: 2 }}>
                                                        <RouterLink to={`/app/price/edit/${price.id}`}>
                                                            <Button color="primary" variant="contained">
                                                                Редакт.
                                                            </Button>
                                                        </RouterLink>
                                                        </Box>
                                                        <Box sx={{ ml: 2 }}>
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            onClick={(e) => e && onDelete(price.id)}
                                                        >
                                                            Удалить
                                                        </Button>
                                                        </Box>
                                                    </Box>
                                                    </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                    :
                                    <Typography>
                                        Нет прайса
                                    </Typography>
                                }
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default PriceCategoryInfo;
