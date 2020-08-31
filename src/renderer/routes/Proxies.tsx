import React from 'react';

import {
  Input,
  Select,
  Button,
  Form,
  Modal,
  notification,
  Table,
  Tag,
  Empty
} from 'antd';
import {
  ThunderboltOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';

import { ipcRenderer } from 'electron';
import { useVT } from 'virtualizedtableforantd4';

import Store from '../store/Store';
import { ProxyCreationModal } from '../../common/types';

const { Option } = Select;
const { TextArea } = Input;
const { Column } = Table;

export const Proxies = () => {
  const store = Store.useStore();
  const popupState = store.get('ProxyCreationModal');
  const proxyListActive = store.get('proxyListActive');
  return (
    <div className="container full">
      <ProxiesHeader />
      <ProxyCreationModal {...popupState} />
      {proxyListActive
        ? <ProxyTable proxyList={proxyListActive} />
        : <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>No proxies found... load some or create a list!</span>
          }
        ></Empty>}
    </div>
  )
}

const ProxiesHeader = () => {
  const store = Store.useStore();
  const proxies = store.get('proxies');
  const proxyListActive = store.get('proxyListActive');
  const selectedRowKeys = store.get('proxySelectedRowKeys');

  const handleChange = async (value: string) => {
    store.set('proxyListActive')(value);
  }

  const handleDelete = async () => {
    if (proxyListActive) {
      let selectedProxies = proxies[proxyListActive];
      let newProxies;
      const proxyLength = selectedRowKeys.length === 0 ? proxies[proxyListActive].length : selectedRowKeys.length;
      if (proxyLength === proxies[proxyListActive].length || proxyLength === 0) {
        newProxies = await ipcRenderer.sendSync('delete-proxies', proxyListActive);
        notification.open({
          message: `Proxy list "${proxyListActive}" successfully deleted`,
          description: `Deleted ${proxyLength} ${proxyLength > 0 ? 'proxies' : 'proxy'}.`,
          placement: 'bottomRight',
          duration: 2
        });
        store.set('proxyListActive')('');
      } else if (proxyLength > 0) {
        selectedProxies = selectedProxies.filter((p) => !selectedRowKeys.includes(p))
        newProxies = await ipcRenderer.sendSync('add-proxies', proxyListActive, selectedProxies);
        notification.open({
          message: `Proxy list "${proxyListActive}" successfully updated`,
          description: `Deleted ${proxyLength} ${proxyLength > 0 ? 'proxies' : 'proxy'}.`,
          placement: 'bottomRight',
          duration: 2
        });
      }
      store.set('proxies')(newProxies);
      store.set('proxySelectedRowKeys')([]);
    }
  }

  return (
    <div className="section-header">
      <div className="inline-form-items proxies">
        <Button
          className="inline-form-item secondary"
          onClick={() => store.set('ProxyCreationModal')({ visible: true })}
        ><PlusOutlined />Create</Button>
        <Select
          className="inline-form-item"
          onChange={handleChange}
          value={proxyListActive}
        >
          {Object.entries(proxies).map((p) => {
            return <Option key={p[0]} value={p[0]}>{p[0]} ({p[1].length})</Option>
          })}
        </Select>
        <Button
          className="inline-form-item"
          type="primary"
          danger
          onClick={handleDelete}
        ><DeleteOutlined />Delete {selectedRowKeys.length === 0 ? 'All' : 'Selected'}</Button>
        <Button
          className="inline-form-item"
          type="primary"
        ><ThunderboltOutlined />Test {selectedRowKeys.length === 0 ? 'All' : 'Selected'}</Button>
        <Button
          className="inline-form-item secondary"
        ><DownloadOutlined />Import</Button>
        <Button
          className="inline-form-item secondary"
        ><UploadOutlined />Export</Button>
      </div>
    </div>
  )
}

const ProxyTable = ({ proxyList }: { proxyList: string }) => {

  const store = Store.useStore();
  const proxies = store.get('proxies');
  const activeProxyList = proxies[proxyList];
  const activeProxies = activeProxyList.map((proxy) => {
    const p = proxy.split(':');
    return {
      key: proxy,
      id: activeProxyList.indexOf(proxy),
      ip: p[0],
      port: p[1],
      user: p[2] ? p[2] : '',
      pass: p[3] ? p[3] : ''
    }
  })

  const selectRow = (record: any) => {
    const selectedRowKeys = [...store.get('proxySelectedRowKeys')];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    store.set('proxySelectedRowKeys')(selectedRowKeys);
  }

  const onSelectedRowKeysChange = (selectedRowKeys: any) => {
    store.set('proxySelectedRowKeys')(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys: store.get('proxySelectedRowKeys'),
    onChange: onSelectedRowKeysChange,
  };

  const [ vt ] = useVT(() => ({ scroll: { y: "calc(100vh - 241px)" } }), []);

  return (
    <Table
      components={vt}
      // size="middle"
      tableLayout="auto"
      scroll={{ y: "calc(100vh - 241px)" }}
      dataSource={activeProxies}
      pagination={false}
      rowSelection={rowSelection}
      onRow={(record) => ({
        onClick: () => {
          selectRow(record);
        },
      })}
    >
      <Column title="ID" dataIndex="id" key="id" ellipsis={true} />
      <Column title="IP" dataIndex="ip" key="ip" ellipsis={true} />
      <Column title="Port" dataIndex="port" key="port" width={100} ellipsis={true} />
      <Column title="User" dataIndex="user" key="user" width={200} ellipsis={true} />
      <Column title="Pass" dataIndex="pass" key="pass" width={200} ellipsis={true} />
      <Column
        title="Status"
        key="status"
        width={150}
        render={() => (
          <Tag key="status">
            Idle
          </Tag>
        )}
      />
      <Column
        title="Actions"
        key="actions"
        render={() => (
          <div className="task-action-btns">
            <Button size="small">
              <ThunderboltOutlined />
            </Button>
            <Button size="small" type="primary" danger>
              <DeleteOutlined />
            </Button>
          </div>
        )}
      />
    </Table>
  )
}

const ProxyCreationModal = (state: ProxyCreationModal) => {
  const store = Store.useStore();
  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (instructions) => {
        let proxies = instructions.proxies.trim().split('\n');
        const name = instructions.name;
        proxies = ipcRenderer.sendSync('add-proxies', name, proxies);
        form.resetFields();
        store.set('proxies')(proxies);
        store.set('proxyListActive')(name);
        store.set('ProxyCreationModal')({ visible: false });
        const proxyLength = proxies[name].length;
        notification.open({
          message: `Proxy list successfully created`,
          description: `Created proxy list "${name}" containing ${proxyLength} ${proxyLength > 0 ? 'proxies' : 'proxy'}.`,
          placement: 'bottomRight',
          duration: 2
        })
        form.resetFields();
      })
  }

  return (
    <Modal
      title="Create Proxy List"
      okText="Create"
      centered
      visible={state.visible}
      onOk={onSubmit}
      onCancel={() => store.set('ProxyCreationModal')({ visible: false })}
    >
      <Form
        layout={'vertical'}
        form={form}
      >
        <Form.Item
          name="name"
          label="Proxy List Name"
          rules={[{ required: true, message: "Please enter a proxy list name" }]}
        >
          <Input placeholder="name" />
        </Form.Item>
        <Form.Item
          name="proxies"
          label="Proxies"
          rules={[{ required: true, message: "Please enter proxies" }]}
        >
          <TextArea rows={6} placeholder="ip:port:user:pass" />
        </Form.Item>
      </Form>
    </Modal>
  )
}