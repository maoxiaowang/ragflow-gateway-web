import {Route, Routes} from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AppLayout from '@/layouts/AppLayout';
import {RequireAuth} from '@/auth/auth.guard';
import {UserListPage} from "@/moudules/user/pages/UserList";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 登录页独立 */}
      <Route path="/login" element={<Login/>}/>

      {/* 统一布局的管理页面 */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout/>
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard/>}/> {/* / */}
        <Route path="/users" element={<UserListPage />} />
        {/* 后续管理页面可以继续增加 */}
      </Route>
    </Routes>
  );
}