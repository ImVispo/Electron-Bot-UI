import React, { ForwardRefExoticComponent } from 'react';
import { Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ControlOutlined,
  AreaChartOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  UserOutlined,
  MailOutlined,
  ThunderboltOutlined,
  SettingOutlined
} from '@ant-design/icons';
import "antd/dist/antd.css";
import "../styles/style.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

type TIcon = 'DashboardOutlined'
  | 'ControlOutlined'
  | 'AreaChartOutlined'
  | 'CalendarOutlined'
  | 'UnorderedListOutlined'
  | 'UserOutlined'
  | 'MailOutlined'
  | 'ThunderboltOutlined'
  | 'SettingOutlined'

type TIconWithComponent = {
  [key in TIcon]: ForwardRefExoticComponent<{}>
}

const IconsWithComponent: TIconWithComponent = {
  'DashboardOutlined': DashboardOutlined,
  'ControlOutlined': ControlOutlined,
  'AreaChartOutlined': AreaChartOutlined,
  'CalendarOutlined': CalendarOutlined,
  'UnorderedListOutlined': UnorderedListOutlined,
  'UserOutlined': UserOutlined,
  'MailOutlined': MailOutlined,
  'ThunderboltOutlined': ThunderboltOutlined,
  'SettingOutlined': SettingOutlined
}

type SubItemProps = {
  name: string;
  icon: TIcon;
  route: string;
  isActive?: boolean;
}

export type NavbarItemProps = {
  parent: string,
  icon: TIcon,
  subItems: SubItemProps[]
}

export type NavbarProps = {
  routes: NavbarItemProps[];
}

export const Navbar = (props: NavbarProps) => {
  const { routes } = props;
  return (
    <Sider>
      <Menu
        style={{ height: '100%' }}
        defaultSelectedKeys={['Tasks']}
        defaultOpenKeys={['Dashboard']}
        mode="inline"
      >
        {routes.map((r) => {
          return <NavbarItem {...r} key={r.parent} />
        })}
      </Menu>
    </Sider>
  )
}

const NavbarItem = (props: NavbarItemProps) => {
  const {
    parent,
    icon,
    subItems,
    ...other
  } = props;
  return (
    <SubMenu {...other}
      key={parent}
      title={
        <span>
          {React.createElement(IconsWithComponent[icon], {}, null)}
          <span>{parent}</span>
        </span>
      }>
      {subItems.map((si) => {
        return <Menu.Item
          key={si.name}
          icon={React.createElement(IconsWithComponent[si.icon], {}, null)}
        >
          <Link to={si.route}>{si.name}</Link>
        </Menu.Item>
      })}
    </SubMenu>
  )
}