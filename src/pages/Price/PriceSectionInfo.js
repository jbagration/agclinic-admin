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
    TableRow,
    Breadcrumbs,
    TableCell,
    TableBody,
    Table,
    Paper,
    Typography,
    CardHeader
} from '@material-ui/core';
import {
    TableContainer
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {makeStyles} from '@material-ui/styles';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useGet} from '../../API/request';
import { PriceCategoryRow } from "./PriceCategoryRow"
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";


const PriceSectionInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [section, setSection] = useState({});
    const [categories, setCategories] = useState([])

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
        }, 1400);
    };

    const loadSection = () => {
        setIsLoaded(true)
        getU(`price/section/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setSection(resp.data.section)
                    setCategories(resp.data.section.category)
                    setCount(resp.data.section.category.length)
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
        loadSection()
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
                <title>Информация раздела</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    <Button startIcon={<ChevronLeft/>} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                    Прайс
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14 }}>
                    <Link underline="hover" color="inherit" to="/app/price-sections">
                        Разделы
                    </Link>
                        <p>{section?.value}</p>
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
                                                {section?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                Раздел:
                                            </div>
                                            <div className="text">
                                                {section?.value || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города:
                                            </div>
                                            <div className="text">
                                                {section?.city?.map(el => el.name)?.join(', ') || '---'}
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
                                    {categories?.length ?
                                    <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{width: 80}}>
                                                Id
                                            </TableCell>
                                            <TableCell>
                                                Название категории
                                            </TableCell>
                                            <TableCell>
                                                Дата создания
                                            </TableCell>
                                            <TableCell>
                                                Дата обновления
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                    <Box sx={{marginLeft: 2}}>
                                                        <Link to={`/app/price-category/add/${id}`}>
                                                            <Button color="primary" variant="contained">
                                                                Добавить категорию в раздел
                                                            </Button>
                                                        </Link>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categories.map((row) => (
                                                <PriceCategoryRow key={row.id} row={row} showAlert={showAlert} loadSection={loadSection} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                    :
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography>
                                                Нет вложенных категорий
                                            </Typography>
                                            <Box sx={{ marginLeft: 2 }}>
                                                <Link to={`/app/price-category/add/${id}`}>
                                                    <Button color="primary" variant="contained">
                                                        Добавить категорию в раздел
                                                    </Button>
                                                </Link>
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

export default PriceSectionInfo;
