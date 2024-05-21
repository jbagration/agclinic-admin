import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {styled} from '@material-ui/core/styles';
import DashboardNavbar from '../components/Nav/DashboardNavbar';
import DashboardSidebar from '../components/Nav/DashboardSidebar';
import {GlobalLoader} from '../components/GlobalLoader/index';
import {Confirm} from '../components/Confirm';
import {AlertProvider} from '../components/Alert';

const DashboardLayoutRoot = styled('div')(
    ({theme}) => ({
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    })
);

const DashboardLayoutWrapper = styled('div')(
    ({theme}) => ({
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        paddingTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    })
);

const DashboardLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
});

const DashboardLayoutContent = styled('div')({
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
});

const DashboardLayout = () => {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <DashboardLayoutRoot>
            <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)}/>
            <DashboardSidebar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
            <DashboardLayoutWrapper>
                <DashboardLayoutContainer>
                    <DashboardLayoutContent sx={{position: 'relative'}}>
                        <Confirm>
                            <AlertProvider>
                                <GlobalLoader>
                                    <Outlet/>
                                </GlobalLoader>
                            </AlertProvider>
                        </Confirm>
                    </DashboardLayoutContent>
                </DashboardLayoutContainer>
            </DashboardLayoutWrapper>
        </DashboardLayoutRoot>
    );
};

export default DashboardLayout;
