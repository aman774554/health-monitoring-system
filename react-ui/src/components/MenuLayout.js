import React from 'react';
import Insight from './Insight';
import HealthPlan from './HealthPlan';
import UsersData from './UsersData';
import './style.css'
import logo from '../images/logo.webp'
import { Routes, Route, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Image } from 'antd';
const { Header, Content, Sider } = Layout;
const getItem = (label, key) => ({
  key,
  label,
});

const items2 = [
  getItem(<Link to="/dashboard">View Insights</Link>, 'View Insights'),
  getItem(<Link to="/plan">Health Plan</Link>, 'plan'),
  getItem(<Link to="/users">Users Data</Link>, 'users'),
];

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={
      {
        minHeight:"100vh"
      }
    }>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image width={70} preview={false} src={logo} />
        <h2 className='text-heading'>Health Monitoring System</h2>
        
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Health Monitoring System</Breadcrumb.Item>

          <Breadcrumb.Item>Menu</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
        className="content-box" 
          style={{
            minHeight:"75vh",
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
              }}
              items={items2}
            />
          </Sider>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path='*' element={<Insight/>} />
              <Route path='/plan' element={<HealthPlan/>} />
              <Route path='/users' element={<UsersData/>} />
            </Routes>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};
export default App;