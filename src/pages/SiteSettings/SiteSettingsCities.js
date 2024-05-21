import React, {useState, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {Link as RouterLink, useSearchParams} from 'react-router-dom';
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
    Divider
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import UserListSkelet from '../../skeletons/UserListSkelet';
import {useDelete, useGet} from '../../API/request';
import {useConfirm} from "../../components/Confirm/index";
import {BallTriangle} from "react-loader-spinner";
import '../../styles/All.css'

const SiteSettingsCities = () => {

    const confirm = useConfirm();
    const getU = useGet();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoaded, setIsLoaded] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [values, setValues] = useState([]);
    const [settings, setSettings] = useState([]);

    const processSiteSettings = (settings, cities) => {
        const updatedSettings = settings.map((setting) => {
          const city = cities.find((city) => parseInt(city.id) === parseInt(setting.city_id));
          if (city) {
            return {
              ...setting,
              city_name: city.name,
            };
          }
          return setting;
        });
        return updatedSettings;
      };

      const loadCities = () => {
        setIsDataLoading(true);
        setIsLoaded(true);

        getU('city')
          .then((resp) => {
            if (resp.status === 'success') {
              setCities(resp.data.city);
              loadSiteSettings();
            }
            setIsDataLoading(false);
          })
          .catch((err) => {
            console.log(err.response);
            setCount(0);
            setIsDataLoading(false);
          })
          .finally(() => {
            setIsLoaded(false);
          });
      };

      const processAndSetSiteSettings = (settings, cities) => {
        const updatedSettings = processSiteSettings(settings, cities);
        setValues(updatedSettings);
      };

    const loadSiteSettings = () => {
        getU(`site_settings`)
          .then((resp) => {
            if (resp.status === 'success') {
                setSettings(resp.data.settings)
                setCount(resp.data.totalCount || 0);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeLimit = (event) => {
        setLimit(event.target.value);
        setPage(0);
    };

    useEffect(() => {
        loadCities();
    }, [page, limit]);

    useEffect(() => {
        processAndSetSiteSettings(settings, cities);
    }, [cities, settings]);

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
                <title>Настройки сайта</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Настройки сайта
                </Box>
            </Box>
            <Box sx={{backgroundColor: 'background.default', minHeight: '100%', py: 3}}>
                <Container maxWidth={false}>
                    {
                        isDataLoading ?
                            <UserListSkelet/>
                            :
                            <>
                                <Box sx={{pt: 3, margin: '0 auto'}}>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Box sx={{marginRight: 3}}>
                                        <RouterLink to="/app/site-settings/add">
                                            <Button color="primary" variant="contained" sx={{margin: 2}}>
                                                Добавить
                                            </Button>
                                        </RouterLink>
                                    </Box>
                                </Box>
                                    <Card>
                                        <PerfectScrollbar>
                                            <Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mx: 2,
                                                    mb: 1
                                                }}>

                                                </Box>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{width: 100}}>
                                                                ID
                                                            </TableCell>
                                                            <TableCell>
                                                                Логотип
                                                            </TableCell>
                                                            <TableCell>
                                                                Город
                                                            </TableCell>
                                                            <TableCell>
                                                                Телефон
                                                            </TableCell>
                                                            <TableCell>
                                                                Короткий телефон
                                                            </TableCell>
                                                            <TableCell>
                                                                Адрес
                                                            </TableCell>
                                                            <TableCell>
                                                                График работы
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {values?.map((setting) => (
                                                            <TableRow hover key={setting.id}>
                                                                <TableCell sx={{width: 80}}>
                                                                    {setting?.id || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                        <Avatar
                                                                            src={
                                                                                setting.logo
                                                                                    ? `${process.env.REACT_APP_API_URL}public/uploads/images/${setting.logo}`
                                                                                    : ''
                                                                            }
                                                                        />
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {setting?.city_name || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {setting?.phone?.map((phone) => (
                                                                        <div key={phone}>{phone}</div>
                                                                    )) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {setting?.short_phone?.map((short_phone) => (
                                                                        <div key={short_phone}>{short_phone}</div>
                                                                    )) || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {setting?.address || '---'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {`${setting?.schedule} c ${setting?.start_schedule} до ${setting?.end_schedule}` || '---'}
                                                                </TableCell>
                                                                <TableCell sx={{maxWidth: '200px'}}>
                                                                    <Box sx={{display: 'flex'}}>
                                                                        <Box sx={{ml: 2}}>
                                                                            <RouterLink
                                                                                to={`/app/site-settings/${setting.city_id
                                                                                }`}>
                                                                                <Button color="primary"
                                                                                        variant="contained"
                                                                                >
                                                                                    Выбрать
                                                                                </Button>
                                                                            </RouterLink>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                        <TableFooter>
                                                            <TableRow>
                                                                <TablePagination
                                                                    labelRowsPerPage={
                                                                        <span>Кол-во строк на странице:</span>}
                                                                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                                                    colSpan={8}
                                                                    count={count}
                                                                    rowsPerPage={limit}
                                                                    page={page}
                                                                    onPageChange={handleChangePage}
                                                                    onRowsPerPageChange={handleChangeLimit}
                                                                />
                                                            </TableRow>
                                                        </TableFooter>
                                                </Table>
                                            </Box>
                                        </PerfectScrollbar>
                                    </Card>
                                </Box>
                            </>
                    }
                </Container>
            </Box>
        </>
    );
};

export default SiteSettingsCities;
