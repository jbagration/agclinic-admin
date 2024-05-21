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
    TableHead,
    Grid,
    Breadcrumbs,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    List,
    ListItem,
    ListItemText,
    Link
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import { useGet, usePut, useDelete } from "../../API/request";
import '../../styles/All.css'
import {BallTriangle} from "react-loader-spinner";
import { useConfirm } from '../../components/Confirm/index';
import CardHeader from '@material-ui/core/CardHeader';

const SiteSettings = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const deleteU = useDelete();
    const {id} = useParams();
    const confirm = useConfirm();

    const [isLoaded, setIsLoaded] = useState(true);

    const [settings, setSettings] = useState({});
    const [city, setCity] = useState(true);

    const onDelete = (id) => {
        confirm({
          title: 'Удаление',
          content: 'Вы уверены, что хотите удалить данные клиники?',
          onConfirm: () => {
            deleteU(`site_settings/${id}`)
              .then((resp) => {
                loadSiteSettings();
              })
              .catch((e) => {
                console.log(e.response);
              });
          }
        });
      };

    const loadSiteSettings = () => {
        setIsLoaded(true)
        getU('city')
            .then((resp) => {
                if (resp.status === 'success') {
                const isCity = resp.data.city;
                isCity.map((city) => {
                    if (city.id === parseInt(id)) {
                        setCity(city);
                    }
                    return null;
                });
                }
            })
            .catch((e) => {
                console.log(e);
            });

        getU(`site_settings/${id}`)
        .then((resp) => {
            if (resp.status === 'success') {
                setSettings(resp.data.settings);
            }
        })
        .catch((e) => {
            console.log(e);
            setSettings(e.response.data)
        })
        .finally(() => {
            setIsLoaded(false);
        });
      }

    useEffect(() => {
        loadSiteSettings();
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
                <title>Настройки сайта для г. {city.name || ''} </title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <RouterLink underline="hover" color="inherit" to="/app/site-settings-cities">
                        Выбрать город
                    </RouterLink>
                        <p>{city.name}</p>
                </Breadcrumbs>
            </Box>
            <Box sx={{ backgroundColor: 'background.default', pt: 3, pb: 1 }}>
                <Container maxWidth={false}>
                    <Card>
                    <CardHeader title={`Настройки сайта для г. ${city.name}`} />
                    <Divider/>
                    <CardContent sx={{ p: 3 }}>
                        {settings?.message === 'Настроек для города с данным id не найдено' ? (
                        <Typography variant="h5">Настроек для города с данным id не найдено</Typography>
                        ) : (
                        <Box sx={{ display: 'flex' }}>
                            <div className="info-block">
                                <div className="wrap">
                                    <div className="label" style={{ width: '200px' }}>
                                        ID:
                                    </div>
                                    <div className="text">
                                        {settings?.id || '---'}
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="label" style={{ width: '200px' }}>
                                        Телефон:
                                    </div>
                                    <div className="text">
                                        {settings?.phone?.map((phone, index) => (
                                            <span key={index}>
                                            {phone}
                                            {index !== settings?.phone.length - 1 && ', '}
                                            </span>
                                        )) || '---'}
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="label" style={{ width: '200px' }}>
                                        Короткий телефон:
                                    </div>
                                    <div className="text">
                                        {settings?.short_phone?.map((shortPhone, index) => (
                                            <span key={index}>
                                            {shortPhone}
                                            {index !== settings?.short_phone.length - 1 && ', '}
                                            </span>
                                        )) || '---'}
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="label" style={{ width: '200px' }}>
                                        Адрес:
                                    </div>
                                    <div className="text">
                                        {settings?.address || '---'}
                                    </div>
                                </div>
                                <div className="wrap">
                                    <div className="label" style={{ width: '200px' }}>
                                        График работы:
                                    </div>
                                    <div className="text">
                                        {`${settings?.schedule}: с ${settings?.start_schedule} до ${settings?.end_schedule}` || '---'}
                                    </div>
                                </div>
                                <div className="wrap" >
                                    <div className="text">
                                        <Table>
                                        <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                <div className="label" style={{ width: '400px' }}>
                                                    Социальные сети:
                                                </div>
                                            </TableCell>
                                            </TableRow>
                                            <TableRow>
                                            <TableCell>Название</TableCell>
                                            <TableCell>Ссылка</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(settings?.social_network) ? (
                                            settings.social_network.map((network) => (
                                                <TableRow key={network.name}>
                                                <TableCell>{network.name}</TableCell>
                                                <TableCell>
                                                    <Link href={network.url} target="_blank" rel="noopener">
                                                    {network.url}
                                                    </Link>
                                                </TableCell>
                                                </TableRow>
                                            ))
                                            ) : (
                                            <TableRow>
                                                <TableCell colSpan={2}>{settings?.social_network || 'No social networks'}</TableCell>
                                            </TableRow>
                                            )}
                                        </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                </div>
                            <div className="wrap">
                                <div className="text">
                                <Avatar
                                    src={`${process.env.REACT_APP_API_URL}public/uploads/images/${settings.logo}`}
                                    className="avatar"
                                    sx={{ width: 200, height: 200 }}
                                />
                                </div>
                            </div>
                        </Box>
                        )}
                    </CardContent>
                    <Divider />
                    {settings?.message ? null : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                            <RouterLink to={`/app/site-settings/edit/${settings.id}`}>
                                <Button color="primary" variant="contained">
                                Редактировать
                                </Button>
                            </RouterLink>
                            <Button
                                sx={{ marginLeft: 3 }}
                                color="error"
                                variant="contained"
                                onClick={(e) => e && onDelete(settings.city_id)}
                            >
                                Удалить
                            </Button>
                        </Box>
                    )}
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default SiteSettings;
