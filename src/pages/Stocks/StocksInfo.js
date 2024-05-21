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
    TableCell,
    TableBody,
    Breadcrumbs,
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

const StocksInfo = () => {

    const navigate = useNavigate();
    const getU = useGet();
    const {id} = useParams();

    const [isLoaded, setIsLoaded] = useState(true);

    const [cities, setCities ] = useState([])
    const [value, setValue] = useState({})

    function stripHtmlTags(html) {
        const regex = /(<([^>]+)>)/gi;
        return html ? html.replace(regex, '') : '';
      }

    useEffect(() => {
        setIsLoaded(true)
        getU(`city`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setCities(resp.data.city)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsLoaded(false)
            });
        getU(`publication/${id}`)
            .then((resp) => {
                if (resp.status === 'success') {
                    setValue(resp.data.publication)
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
                <title>Акция</title>
            </Helmet>
            <Container maxWidth={false} >
                <Box>
                    <Button startIcon={<ChevronLeft />} onClick={() => navigate(-1)}>
                        Назад
                    </Button>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 14, justifyContent: 'flex-start' }}>
                    <Link underline="hover" color="inherit" to="/app/stocks">
                        Акции
                    </Link>
                        <p>{value?.title || 'Акция'}</p>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to={`/app/stocks/edit/${value.id}`}>
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
                                <div className="wrapAvatar">
                                    <div className="avatar-block">
                                        <Avatar src={`${process.env.REACT_APP_API_URL}public/uploads/images/${value.img}`} className="avatar"/>
                                    </div>
                                    <div className="info-block">
                                        <div className="wrap">
                                            <div className="label">
                                                ID:
                                            </div>
                                            <div className="text">
                                                {value?.id || '---'}
                                            </div>
                                        </div>
                                        <div className="wrap">
                                            <div className="label">
                                                Название
                                            </div>
                                            <div className="text">
                                                {value?.title || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Города
                                            </div>
                                            <div className="text">
                                                {value?.city?.map(el => el.name)?.join(', ') || '---'}
                                            </div>
                                        </div>

                                        <div className="wrap">
                                            <div className="label">
                                                Скидка
                                            </div>
                                            <div className="text">
                                                {value?.discount+'%' || '---'}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </PerfectScrollbar>
                        </CardContent>
                    </Card>
                    {value.preview_description && value.preview_description.trim() !== '' && (
                        <Card sx={{marginTop: '10px'}}>
                            <CardHeader title="Краткое описание(превью)" />
                            <CardContent>
                            <div className="wrap">
                                <div className="text">
                                {value.preview_description}
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card sx={{marginTop: '10px'}}>
                        <CardHeader title="Полное описание" />
                        <CardContent>
                            <div className="wrap">
                                <div className="text" dangerouslySetInnerHTML={{__html: value?.description}}>
                                    {/* {stripHtmlTags(value?.description) || '---'} */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default StocksInfo;
