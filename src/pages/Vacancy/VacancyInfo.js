import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {
    Box,
    Avatar,
    Container,
    Button,
    Card,
    CardContent,
    Breadcrumbs,
    Divider,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    CardMedia,
    CardHeader
} from '@material-ui/core';
import {
    TableContainer
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {makeStyles} from '@material-ui/styles';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {useGet} from '../../API/request';
import '../../styles/All.css'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BallTriangle} from "react-loader-spinner";

const VacancyInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [value, setValue] = useState({})

    useEffect(() => {
        setIsLoaded(true)
        getU(`vacancy/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.vacancy)
                }
            })
            .catch((err) => {
                console.log(err)
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
                <title>{value?.title || 'Вакансия'}</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/vacancy">
                        Вакансии
                    </Link>
                        <p>{value?.title || 'Вакансия'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/vacancy/edit/${value.id}`}>
                    <Button color="primary" variant="contained">
                        Редактировать
                    </Button>
                    </Link>
                </Box>
            </Container>
            <Box sx={{backgroundColor: 'background.default', pt: 3, pb: 1}}>
                <Container maxWidth={false}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <PerfectScrollbar>
                                <div className="info-block">
                                    <div className="wrap">
                                        <div className="label" style={{ width: '200px' }}>
                                            ID:
                                        </div>
                                        <div className="text">
                                            {value?.id || '---'}
                                        </div>
                                    </div>

                                    <div className="wrap">
                                        <div className="label" style={{ width: '200px' }}>
                                            Название вакансии
                                        </div>
                                        <div className="text">
                                            {value?.title || '---'}
                                        </div>
                                    </div>

                                    <div className="wrap">
                                        <div className="label" style={{ width: '200px' }}>
                                            Города
                                        </div>
                                        <div className="text">
                                            {value?.city?.map(el => el.name)?.join(', ') || '---'}
                                        </div>
                                    </div>
                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                    <Card sx={{marginTop: '10px'}}>
                        <CardHeader title="Описание вакансии" />
                        <CardContent>
                            <div className="wrap">
                                <div className="text" dangerouslySetInnerHTML={{__html: value?.requirements || '---'}}>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default VacancyInfo;
