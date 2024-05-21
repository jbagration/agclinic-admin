import {Navigate} from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import Account from './pages/Account/Account';
import UserInfo from './pages/User/UserInfo';
import UserEdit from './pages/User/UserEdit';
import UserList from './pages/User/UserList';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Logs from "./pages/Systems/Logs/Logs";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmailTemplateList from "./pages/Templates/Email-Templates/EmailTemplateList";
import EmailTemplateCreate from "./pages/Templates/Email-Templates/EmailTemplateCreate";
import EmailTemplateEdit from "./pages/Templates/Email-Templates/EmailTemplateEdit";
import CommonSettings from "./pages/Systems/CommonSettings/CommonSettings";
import UpdateSystem from "./pages/Systems/UpdateSystem/UpdateSystem";
import SettingsExampl from "./pages/Settings/SettingsExampl";
import UserAdd from "./pages/User/UserAdd";
import EmailHistoryList from "./pages/Templates/Email-Hstory/EmailHistoryList";
import FeedBackList from "./pages/FeedBacks/FeedBackList";
import FeedBackEdit from "./pages/FeedBacks/FeedBackEdit";
import ConfigurationKeysList from './pages/ConfigurationKeys/ConfigurationKeysList';
import ConfigurationKeysAdd from './pages/ConfigurationKeys/ConfigurationKeysAdd';
import ConfigurationKeysEdit from './pages/ConfigurationKeys/ConfigurationKeysEdit';
import AppLogs from './pages/AppWork/AppLogs';
import AppStatistics from './pages/AppStatistics/AppStatistics';
import AppStatisticsEventsList from './pages/AppStatistics/AppStatisticsEventsList';
import AppStatisticsEventsAdd from './pages/AppStatistics/AppStatisticsEventsAdd';
import AppStatisticsEventsEdit from './pages/AppStatistics/AppStatisticsEventsEdit';
import CitiesList from './pages/Cities/CitiesList';
import CityAdd from './pages/Cities/CityAdd';
import CityEdit from './pages/Cities/CityEdit';
import SiteSettings from './pages/SiteSettings/SiteSettings';
import SiteSettingsCities from './pages/SiteSettings/SiteSettingsCities';
import SiteSettingsAdd from './pages/SiteSettings/SiteSettingsAdd';
import SiteSettingsEdit from './pages/SiteSettings/SiteSettingsEdit';
import MenuBar from './pages/MenuBar/MenuBar';
import MenuBarAdd from './pages/MenuBar/MenuBarAdd';
import MenuBarEdit from './pages/MenuBar/MenuBarEdit';
import PartnersList from './pages/Partners/PartnersList';
import PartnerAdd from './pages/Partners/PartnerAdd';
import PartnerEdit from './pages/Partners/PartnerEdit';
import SpecialistEdit from './pages/Specialists/SpecialistsEdit';
import SpecialistAdd from './pages/Specialists/SpecialistsAdd';
import SpecialistList from './pages/Specialists/SpecialistsList';
import BeforeAfterAdd from './pages/Specialists/BeforeAfterAdd';
import SpecialistInfo from './pages/Specialists/SpecialistsInfo';
import SeoList from './pages/SEO/SeoList';
import SeoAdd from './pages/SEO/SeoAdd';
import SeoEdit from './pages/SEO/SeoEdit';
import SeoUrlSettings from './pages/SEO/SeoUrlSettings';
import ServiceAdd from './pages/Services/ServicesAdd';
import ServiceList from './pages/Services/ServicesList';
import CategoryList from './pages/Categories/CategoriesList';
import ServiceEdit from './pages/Services/ServicesEdit';
import ServicesInfo from './pages/Services/ServiсesInfo';
import CategoryAdd from './pages/Categories/CategoriesAdd';
import CategoryEdit from './pages/Categories/CategoriesEdit';
import CategoryInfo from './pages/Categories/CategoriesInfo';
import PriceSectionList from './pages/Price/PriceSectionList';
import PriceSectionAdd from './pages/Price/PriceSectionAdd';
import PriceCategoryInfo from './pages/Price/PriceCategoryInfo';
import PriceSectionEdit from './pages/Price/PriceSectionEdit';
import PriceCategoryAdd from './pages/Price/PriceCategoryAdd';
import PriceCategoryEdit from './pages/Price/PriceCategoryEdit';
import PriceSectionInfo from './pages/Price/PriceSectionInfo';
import NewsList from './pages/News/NewsList';
import NewsAdd from './pages/News/NewsAdd';
import NewsEdit from './pages/News/NewsEdit';
import NewsInfo from './pages/News/NewsInfo';
import StocksList from './pages/Stocks/StocksList';
import StocksAdd from './pages/Stocks/StocksAdd';
import StocksEdit from './pages/Stocks/StocksEdit';
import StocksInfo from './pages/Stocks/StocksInfo';
import PriceAdd from './pages/Price/PriceAdd';
import PriceEdit from './pages/Price/PriceEdit';
import PriceInfo from './pages/Price/PriceInfo';
import RecordingToSpecialistAdd from './pages/RecordingToSpecialist/RecordingAdd';
import RecordingToSpecialistList from './pages/RecordingToSpecialist/RecordingList';
import RecordingToProcedureAdd from './pages/RecordingToProcedure/RecordingAdd';
import RecordingToProcedureList from './pages/RecordingToProcedure/RecordingList';
import CommentsList from './pages/Comments/CommentsList';
import CommentsInfo from './pages/Comments/CommentsInfo';
import VacancyList from './pages/Vacancy/VacancyList';
import VacancyAdd from './pages/Vacancy/VacancyAdd';
import VacancyEdit from './pages/Vacancy/VacancyEdit';
import VacancyInfo from './pages/Vacancy/VacancyInfo';
import BannerInfo from './pages/Banners/BannerInfo';
import BannerEdit from './pages/Banners/BannerEdit';
import BannerAdd from './pages/Banners/BannerAdd';
import BannersList from './pages/Banners/BannersList';
import DocumentInfo from './pages/Documents/DocumentInfo';
import DocumentEdit from './pages/Documents/DocumentEdit';
import DocumentAdd from './pages/Documents/DocumentAdd';
import DocumentsList from './pages/Documents/DocumentsList';
import TroublesList from './pages/Troubles/TroublesList';
import TroublesEditImg from './pages/Troubles/TroublesEditImg';
import PriceDiscount from './pages/Price/PriceDiscount';
import SpecialistsCertificateAdd from './pages/Specialists/SpecialistsCertificateAdd';
import SpecialistsAdditionalAttachmentsEditImage from './pages/Specialists/SpecialistsAdditionalAttachmentsEditImage';
import SpecialistsAdditionalAttachmentsEditVideo from './pages/Specialists/SpecialistsAdditionalAttachmentsEditVideo';
import PriceСomparison from './pages/Price/PriceСomparison';
import PriceDownload from './pages/Price/PriceDownload';

const routes = [
    {
        path: 'app',
        element: <DashboardLayout/>,
        children: [
            {path: 'account', element: <Account/>},
            {path: 'dashboard', element: <Dashboard/>},

            {path: 'user/:id', element: <UserInfo/>},
            {path: 'user/edit/:id', element: <UserEdit/>},
            {path: 'user/add', element: <UserAdd/>},
            {path: 'users', element: <UserList/>},

            {path: 'services/:id', element: <ServicesInfo/>},
            {path: 'services/edit/:id', element: <ServiceEdit/>},
            {path: 'services/add', element: <ServiceAdd/>},
            {path: 'services', element: <ServiceList/>},

            {path: 'categories/:id', element: <CategoryInfo/>},
            {path: 'categories/edit/:id', element: <CategoryEdit/>},
            {path: 'categories/add/:id', element: <CategoryAdd/>},
            {path: 'categories', element: <CategoryList/>},

            {path: 'specialist/:id', element: <SpecialistInfo/>},
            {path: 'specialist/edit/:id', element: <SpecialistEdit/>},
            {path: 'specialist/add', element: <SpecialistAdd/>},
            {path: 'specialists', element: <SpecialistList/>},
            {path: 'specialist/before_after/add/:id', element: <BeforeAfterAdd/>},
            {path: 'specialist/additional_attachments/add/:id', element: <SpecialistsCertificateAdd/>},
            {path: 'specialist/additional_attachments/edit/images/:id', element: <SpecialistsAdditionalAttachmentsEditImage/>},
            {path: 'specialist/additional_attachments/edit/video/:id', element: <SpecialistsAdditionalAttachmentsEditVideo/>},

            {path: 'news/:id', element: <NewsInfo/>},
            {path: 'news/edit/:id', element: <NewsEdit/>},
            {path: 'news/add', element: <NewsAdd/>},
            {path: 'news', element: <NewsList/>},

            {path: 'stocks/:id', element: <StocksInfo/>},
            {path: 'stocks/edit/:id', element: <StocksEdit/>},
            {path: 'stocks/add', element: <StocksAdd/>},
            {path: 'stocks', element: <StocksList/>},

            {path: 'recording_to_specialist/add', element: <RecordingToSpecialistAdd/>},
            {path: 'recording_to_specialist', element: <RecordingToSpecialistList/>},

            {path: 'recording_to_procedure/add', element: <RecordingToProcedureAdd/>},
            {path: 'recording_to_procedure', element: <RecordingToProcedureList/>},

            {path: 'feedbacks/edit/:id', element: <FeedBackEdit/>},
            {path: 'feedbacks', element: <FeedBackList/>},

            { path: 'email-templates', element: <EmailTemplateList /> },
            { path: 'email-history', element: <EmailHistoryList /> },
            { path: 'email-templates/create', element: <EmailTemplateCreate /> },
            { path: 'email-templates/edit/:id', element: <EmailTemplateEdit /> },

            {path: 'app-logs', element: <AppLogs/>},

            {path: 'app-statistics', element: <AppStatistics/>},
            {path: 'app-statistics/events', element: <AppStatisticsEventsList/>},
            {path: 'app-statistics/events/add', element: <AppStatisticsEventsAdd/>},
            {path: 'app-statistics/events/edit/:id', element: <AppStatisticsEventsEdit/>},

            {path: 'logs', element: <Logs/>},
            {path: 'common-settings', element: <CommonSettings/>},
            {path: 'update-system', element: <UpdateSystem/>},

            {path: 'settings', element: <SettingsExampl/>},

            {path: 'configuration/keys', element: <ConfigurationKeysList/>},
            {path: 'configuration/keys/add', element: <ConfigurationKeysAdd/>},
            {path: 'configuration/keys/edit/:id', element: <ConfigurationKeysEdit/>},

            {path: 'cities', element: <CitiesList/>},
            {path: 'city/add', element: <CityAdd/>},
            {path: 'city/edit/:id', element: <CityEdit/>},

            {path: 'site-settings-cities', element: <SiteSettingsCities/>},
            {path: 'site-settings/:id', element: <SiteSettings/>},
            {path: 'site-settings/add', element: <SiteSettingsAdd/>},
            {path: 'site-settings/edit/:id', element: <SiteSettingsEdit/>},

            {path: 'menu-bar', element: <MenuBar/>},
            {path: 'menu-bar-add', element: <MenuBarAdd/>},
            {path: 'menu-bar-edit/:id', element: <MenuBarEdit/>},

            {path: 'partners', element: <PartnersList/>},
            {path: 'partners/add', element: <PartnerAdd/>},
            {path: 'partners/edit/:id', element: <PartnerEdit/>},

            {path: 'seo', element: <SeoList/>},
            {path: 'seo/add', element: <SeoAdd/>},
            {path: 'seo/edit/:id', element: <SeoEdit/>},
            {path: 'seo/url/:id', element: <SeoUrlSettings/>},

            {path: 'price-sections', element: <PriceSectionList/>},
            {path: 'price-sections/info/:id', element: <PriceSectionInfo/>},
            {path: 'price-sections/add/', element: <PriceSectionAdd/>},
            {path: 'price-sections/category/info/:id', element: <PriceCategoryInfo/>},
            {path: 'price-sections/edit/:id', element: <PriceSectionEdit/>},
            {path: 'price-category/add/:id', element: <PriceCategoryAdd/>},
            {path: 'price-sections/category/edit/:id', element: <PriceCategoryEdit/>},
            {path: 'price/add/:id', element: <PriceAdd/>},
            {path: 'price/price-comparison', element: <PriceСomparison/>},
            {path: 'price/download', element: <PriceDownload/>},
            {path: 'price/edit/:id', element: <PriceEdit/>},
            {path: 'price/info/:id', element: <PriceInfo/>},
            {path: 'price/discount/:id', element: <PriceDiscount/>},

            {path: 'comments', element: <CommentsList/>},
            {path: 'comments/info/:id', element: <CommentsInfo/>},

            {path: 'vacancy/:id', element: <VacancyInfo/>},
            {path: 'vacancy/edit/:id', element: <VacancyEdit/>},
            {path: 'vacancy/add', element: <VacancyAdd/>},
            {path: 'vacancy', element: <VacancyList/>},

            {path: 'banner/:id', element: <BannerInfo/>},
            {path: 'banner/edit/:id', element: <BannerEdit/>},
            {path: 'banner/add', element: <BannerAdd/>},
            {path: 'banners', element: <BannersList/>},

            {path: 'document/:id', element: <DocumentInfo/>},
            {path: 'document/edit/:id', element: <DocumentEdit/>},
            {path: 'document/add', element: <DocumentAdd/>},
            {path: 'documents', element: <DocumentsList/>},

            {path: 'troubles', element: <TroublesList/>},
            {path: 'troubles/img/:id', element: <TroublesEditImg/>},

            {path: '', element: <Navigate to="/app/users"/>},
            {path: '*', element: <Navigate to="/404"/>},

        ]
    },
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {path: 'login', element: <Login/>},
            {path: '404', element: <NotFound/>},
            {path: '/', element: <Navigate to="/app/users"/>},
            {path: '*', element: <Navigate to="/404"/>}
        ]
    }
];

export default routes;
