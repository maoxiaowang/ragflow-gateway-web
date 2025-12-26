import {Navigate, Route, Routes} from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AppLayout from '@/layouts/AppLayout';
import {RequireAuth} from '@/auth/RequireAuth';
import {UserListPage} from "@/moudules/user/pages/UserList";
import {DatasetPage} from "@/moudules/dataset/pages/DatasetList";
import {ROUTES} from "./paths";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 登录页（无 Layout） */}
      <Route path={ROUTES.auth.login.path} element={<Login />} />

      {/* 根路径只做 redirect */}
      <Route
        path="/"
        element={<Navigate to={ROUTES.dashboard.path} replace />}
      />

      {/* 需要登录 + Layout 的页面 */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path={ROUTES.dashboard.path} element={<Dashboard />} />
        <Route path={ROUTES.users.list.path} element={<UserListPage />} />
        <Route path={ROUTES.datasets.list.path} element={<DatasetPage />} />
      </Route>
    </Routes>
  );
}