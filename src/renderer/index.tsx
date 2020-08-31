import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';

import { Layout } from 'antd';

import { Navbar, NavbarProps } from './components/Navbar';
import { Header } from './components/Header';
import { BotFooter } from './components/Footer';

import InitialLoad from './components/InitialLoad'
import { Tasks } from './routes/Tasks';
import { Proxies } from './routes/Proxies';
import { SettingsPage } from './routes/Settings';

import Store from './store/Store';

const routes: NavbarProps = {
  routes: [
    {
      parent: 'Dashboard',
      icon: 'DashboardOutlined',
      subItems: [
        {
          name: 'Tasks',
          icon: 'UnorderedListOutlined',
          route: '/Tasks'
        },
        {
          name: 'Calendar',
          icon: 'CalendarOutlined',
          route: '/Calendar'
        },
        {
          name: 'Analytics',
          icon: 'AreaChartOutlined',
          route: '/Analytics'
        }
      ]
    },
    {
      parent: 'Utilities',
      icon: 'ControlOutlined',
      subItems: [
        {
          name: 'Profiles',
          icon: 'UserOutlined',
          route: '/Profiles'
        },
        {
          name: 'Emails',
          icon: 'MailOutlined',
          route: '/Emails'
        },
        {
          name: 'Proxies',
          icon: 'AreaChartOutlined',
          route: '/Proxies'
        },
        {
          name: 'Settings',
          icon: 'SettingOutlined',
          route: '/Settings'
        }
      ]
    }
  ]
}

ReactDOM.render(
  <Store.Container>
    <Layout>
      <Header />
      <Layout>
        <Router>
          <InitialLoad />
          <Navbar {...routes} />
          <Route path="/Tasks" component={Tasks} />
          <Route path="/Proxies" component={Proxies} />
          <Route path="/Settings" component={SettingsPage} />
        </Router>
      </Layout>
      <BotFooter />
    </Layout>
  </Store.Container>,
  document.getElementById('app')
)