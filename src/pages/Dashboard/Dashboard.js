import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import {useGet} from '../../API/request';
import {BallTriangle} from 'react-loader-spinner';
import StatisticsItem from "../../components/dashboard/StatisticsItem";

const Dashboard = () => {

    const [loaded, setLoaded] = useState(true);

    const getU = useGet();

    const [data, setData] = useState({
        date: 0,
    });

    useEffect(() => {
        setLoaded(false)
        /*
        getU('')
            .then((response) => {
                if (response.status === 'success') {
                    setData(response.data);
                }
            })
            .catch(() => {

            })
            .finally(() =>{
                setLoaded(false);
            });
            */
    }, []);

    if (loaded) {
        return (
            <div className="loader">
                <BallTriangle
                    height="100"
                    width="100"
                    color='grey'
                    ariaLabel='loading'
                />
            </div>
        )
    }

    return (
        <>

            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box className="headerWrapper">
                <Box className="headerTitle">
                    Статистика
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    py: 3
                }}
            >
                <Container maxWidth={false}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            xl={4}
                            xs={12}
                        >
                            <StatisticsItem name={data?.date}/>
                        </Grid>
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            xl={4}
                            xs={12}
                        >
                            <StatisticsItem name={data?.date}/>
                        </Grid>
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            xl={4}
                            xs={12}
                        >
                            <StatisticsItem name={data?.date}/>
                        </Grid>
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            xl={4}
                            xs={12}
                        >
                            <StatisticsItem name={data?.date}/>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};


export default Dashboard;
