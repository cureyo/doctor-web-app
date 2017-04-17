import { MenuType, RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', menuType: MenuType.LEFT, icon: 'material-icons' },
    { path: 'caredoneprofiles', title: 'Cared One Profiles', menuType: MenuType.LEFT, icon:'material-icons' },
    { path: 'careplans', title: 'Care Plans', menuType: MenuType.LEFT, icon:'material-icons' },
    { path: 'weeklyreports', title: 'Weekly Health Reports', menuType: MenuType.LEFT, icon:'material-icons' },
    
];
