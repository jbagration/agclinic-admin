import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';

const StatisticsItem = ({ name, ...props }) => {

    return (
        <Card
            sx={{ height: '100%', borderRadius: 3,  backgroundColor: 'rgb(224,255,214)' }}
            {...props}
        >
            <CardContent>
                <Grid
                    container
                    spacing={3}
                    sx={{justifyContent: 'space-between'}}
                >
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h6"
                        >
                            Количество пользователей
                        </Typography>
                        <Typography
                            color="textPrimary"
                            variant="h3"
                        >
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar
                            sx={{
                                backgroundColor: red[600],
                                height: 56,
                                width: 56
                            }}
                        >
                            <PeopleIcon/>
                        </Avatar>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        pt: 2,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        color="textSecondary"
                        variant="caption"
                    >
                        Subscribers
                    </Typography>
                </Box>


            </CardContent>
        </Card>
    );

};

export default StatisticsItem;
