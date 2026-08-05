import React, { useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, VideoCameraOutlined, LogoutOutlined } from '@ant-design/icons';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import './App.css'; 

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();

  // 如果是登录页，不显示 Layout 布局（可选，看需求，通常登录页是独立的）
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  const items = [
    {
      key: '/',
      icon: <UserOutlined />,
      label: 'Home',
    },
    {
      key: '/about',
      icon: <VideoCameraOutlined />,
      label: 'About (Protected)',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu 
            theme="dark" 
            mode="inline" 
            selectedKeys={[location.pathname]} 
            items={items} 
            onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
                退出登录
            </Button>
        </Header>
        <Content style={{ margin: '0 16px' }}>
            <Routes>
                <Route 
                  path="/" 
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  } 
                />
                {/* 使用 RequireAuth 包裹需要保护的路由 */}
                <Route 
                  path="/about" 
                  element={
                    <RequireAuth>
                      <About />
                    </RequireAuth>
                  } 
                />
            </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          React Demo ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
