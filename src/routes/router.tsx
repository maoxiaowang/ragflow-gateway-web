import {Navigate, Route, Routes} from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/register';
import Dashboard from '@/pages/Dashboard';
import AppLayout from '@/layouts/AppLayout';
import {RequireAuth} from '@/auth/RequireAuth';
import {UserListPage} from "@/moudules/iam/pages/UserList";
import {DatasetPage} from "@/moudules/dataset/pages/DatasetList";
import {ROUTES} from "./paths";
import {DatasetDetailPage} from "@/moudules/dataset/pages/DatasetDetail";
import {NotFoundPage} from '@/pages/404/NotFoundPage';


export default function AppRoutes() {
  return (
    <Routes>
      {/* 登录页 */}
      <Route path={ROUTES.auth.login.path} element={<Login/>}/>
      <Route path={ROUTES.auth.register.path} element={<Register/>}/>

        {/* 未登录的 404 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />

      {/* 根路径只做 redirect */}
      <Route
      path="/"
      element={<Navigate to={ROUTES.dashboard.path} replace/>}
      />

      {/* 需要登录 + Layout 的页面 */}
      <Route
      element={
      <RequireAuth>
      <AppLayout/>
      </RequireAuth>
      }
      >
      <Route path={ROUTES.dashboard.path} element={<Dashboard/>}/>
      <Route path={ROUTES.users.list.path} element={<UserListPage/>}/>
      <Route path={ROUTES.datasets.list.path} element={<DatasetPage/>}/>
      <Route path={ROUTES.datasets.detail.path} element={<DatasetDetailPage/>}/>

    </Route>
</Routes>
)
  ;
}