import {useEffect, useContext, useState} from 'react';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    List,
    Typography
} from '@material-ui/core';
import {
    BarChart as BarChartIcon,
    Users as UsersIcon,
    Mail as MailIcon,
    DollarSign as Payment,
    Settings,
    MapPin,
    Briefcase,
    Menu,
    FileText,
    Activity,
    ChevronUp,
    ChevronsUp,
    Gift,
    Shield,
    Grid,
    Square,
    Bookmark,
    Search,
    Book,
    AlertOctagon,
    UserPlus,
    File,
    List as ListIcon,
    PhoneForwarded,
    Monitor, Layers,
    Archive, Percent,
    UserCheck
} from 'react-feather';
import NavItem from './NavItem';
import {useGet} from '../../API/request';
import {useSelector} from 'react-redux';


const itemsDesign = [
    {
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Статистика',
    },
    {
        href: '/app/users',
        icon: UsersIcon,
        title: 'Пользователи',
    },
    {
        href: '/app/specialists',
        icon: UsersIcon,
        title: 'Специалисты',
    },
    {
        href: '/app/site-settings-cities',
        icon: Settings,
        title: 'Настройки сайта',
    },
    {
        href: '/app/cities',
        icon: MapPin,
        title: 'Города',
    },
    {
        href: '/app/menu-bar',
        icon: Menu,
        title: 'Пункты меню',
    },
    {
        href: '/app/services',
        icon: Briefcase,
        title: 'Услуги',
    },
    {
        href: '/app/categories',
        icon: Layers,
        title: 'Категории услуг',
    },
    {
        href: '/app/partners',
        icon: UsersIcon,
        title: 'Партнёры',
    },
    {
        href: '/app/seo',
        icon: Search,
        title: 'SEO',
    },
    {
        href: '/app/price-sections',
        icon: Payment,
        title: 'Прайс',
    },
    {
        href: '/app/news',
        icon: Archive,
        title: 'Новости',
    },
    {
        href: '/app/stocks',
        icon: Percent,
        title: 'Акции',
    },
    {
        href: '/app/recording_to_procedure',
        icon: FileText,
        title: 'Запись на процедуру',
    },
    {
        href: '/app/recording_to_specialist',
        icon: UserCheck,
        title: 'Запись к специалисту',
    },
    {
        href: '/app/comments',
        icon: Book,
        title: 'Комментарии',
    },
    {
        href: '/app/vacancy',
        icon: UserPlus,
        title: 'Вакансии',
    },
    {
        href: '/app/banners',
        icon: Square,
        title: 'Баннера',
    },
    {
        href: '/app/documents',
        icon: FileText,
        title: 'Документы',
    },
    {
        href: '/app/troubles',
        icon: Activity,
        title: 'Проблемы',
    },
];

const itemsSystem = [
    {
        href: '/app/feedbacks',
        icon: File,
        title: 'Обратная связь'
    },
    {
        icon: MailIcon,
        title: 'Шаблоны Почты',
        list: [
            {
                href: '/app/email-templates',
                icon: Settings,
                title: 'Шаблоны'
            },
            {
                href: '/app/email-history',
                icon: Settings,
                title: 'История'
            }
        ]
    },
    {
        href: '/app/settings',
        icon: Settings,
        title: 'Настройки',
        list: [
            {
                href: '/app/settings',
                icon: Settings,
                title: 'Настройки'
            },
            {
                href: '/app/configuration/keys',
                icon: Settings,
                title: 'Конфигуратор ключей'
            },
        ]
    },
    {
        icon: Monitor,
        title: 'Работа приложения',
        list: [
            {
                href: '/app/app-logs',
                icon: Settings,
                title: 'Логи ошибок'
            },
            {
                href: '/app/app-statistics',
                icon: Settings,
                title: 'Статистика'
            }
        ]
    },
    {
        icon: AlertOctagon,
        title: 'Системные',
        list: [
            {
                href: '/app/common-settings',
                icon: Settings,
                title: 'Общие настройки'
            },
            {
                href: '/app/logs',
                icon: Settings,
                title: 'Логи'
            },
            {
                href: '/app/update-system',
                icon: Settings,
                title: 'Обновление системы'
            },
        ]
    },

];

const DashboardSidebar = ({onMobileClose, openMobile}) => {

    const location = useLocation();
    const {username, avatar} = useSelector(state => state?.auth.user)


    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
    }, [location.pathname]);


    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2
                }}
            >
                <Avatar
                    component={RouterLink}
                    //src={`${process.env.REACT_APP_API_URL}/uploads/avatars/${avatar}`}
                    sx={{
                        cursor: 'pointer',
                        width: 64,
                        height: 64,
                        marginBottom: 1
                    }}
                    to="/app/account"
                />
                <Typography
                    color="textPrimary"
                    variant="h5"
                >
                    {username || 'Admin'}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{px: 2}}>
                <List>
                    {itemsDesign.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            list={item?.list}
                        />
                    ))}
                </List>
            </Box>
            <Divider/>
            <Box sx={{px: 2}}>
                <List>
                    {itemsSystem.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            list={item?.list}
                        />
                    ))}
                </List>
            </Box>
            <Typography
                color="textPrimary"
                variant="body2"
                sx={{textAlign: 'center'}}
            >
                v{process.env.REACT_APP_VERSION} {process.env.REACT_APP_STATUS}
            </Typography>
            <Box sx={{flexGrow: 1}}/>
        </Box>
    );

    return (
        <>
            <Box sx={{display: {xs: 'block', lg: 'none'}}}>
                <Drawer
                    anchor="left"
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                    PaperProps={{
                        sx: {
                            width: 256
                        }
                    }}
                >
                    {content}
                </Drawer>

            </Box>
            <Box sx={{display: {xs: 'none', lg: 'block'}}}>
                <Drawer
                    anchor="left"
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: 256,
                            top: 64,
                            height: 'calc(100% - 64px)'
                        }
                    }}
                >
                    {content}
                </Drawer>

            </Box>

        </>
    );
};

DashboardSidebar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
    onMobileClose: () => {
    },
    openMobile: false
};

export default DashboardSidebar;
