import React from 'react';

import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Tag,
  Empty,
  notification
} from 'antd';
import {
  PlusOutlined,
  CaretRightOutlined,
  PauseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons';

import { ipcRenderer } from 'electron';
import { nanoid } from 'nanoid'

import Store from '../store/Store';

import { Task, TaskCreationModal } from '../../common/types';

const { Column } = Table;
const { Search } = Input;

export const Tasks = () => {

  const store = Store.useStore();
  const tasks = store.get('tasks');
  const popupState = store.get('TaskCreationModal');

  return (
    <div className="container full">
      <TaskHeader />
      <TaskTable tasks={tasks} />
      <TaskCreationModal {...popupState} />
    </div>
  )

}

const TaskHeader = () => {

  const store = Store.useStore();

  const confirmClearAll = async (e: React.MouseEvent | undefined) => {
    let tasks = await ipcRenderer.sendSync('clear-tasks');
    store.set('tasks')(tasks);
    notification.open({
      message: `Tasks successfully cleared`,
      description: `Cleared all tasks.`,
      placement: 'bottomRight',
      duration: 2
    })
  }

  return (
    <div>
      <div className="section-header">
        <Button className="action-btn" onClick={() => store.set('TaskCreationModal')({ visible: true })}><PlusOutlined />Create task</Button>
        <Button className="action-btn" type="primary"><CaretRightOutlined />Start all</Button>
        <Button className="action-btn" type="primary" danger><PauseOutlined />Stop all</Button>
        <Popconfirm
          title="Are you sure you want to clear all tasks?"
          onConfirm={confirmClearAll}
          okText="Yes"
          cancelText="No"
        >
          <Button className="action-btn" type="primary" danger><DeleteOutlined />Clear all</Button>
        </Popconfirm>
      </div>
    </div>
  )

}

const TaskTable = ({ tasks }: { tasks: Task[] }) => {
  return (
    <Table
      dataSource={tasks}
      pagination={false}
      size="middle"
      scroll={{ y: "calc(100vh - 241px)" }}
    // bordered
    >
      <Column title="Id" dataIndex="id" key="id" responsive={['sm']} width={100} />
      <Column title="Site" dataIndex="site" key="site" responsive={['sm']} width={100} />
      <Column title="Input" dataIndex="input" key="input" responsive={['md']} ellipsis={true} />
      <Column title="Email" dataIndex="email" key="email" responsive={['sm']} width={100} ellipsis={true} />
      <Column title="Proxy" dataIndex="proxy" key="proxy" responsive={['sm']} width={100} ellipsis={true} />
      <Column
        title="Status"
        key="status"
        responsive={['md']}
        width={200}
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
              <CaretRightOutlined />
            </Button>
            <Button size="small">
              <EditOutlined />
            </Button>
            <Button size="small" type="primary">
              <FileTextOutlined />
            </Button>
            <Button size="small" type="primary" danger>
              <DeleteOutlined />
            </Button>
          </div>
        )}
      />
      {tasks.length === 0 ? <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            Customize <a href="#API">Description</a>
          </span>
        }
      >
        <Button type="primary">Create Now</Button>
      </Empty> : null}
    </Table>
  )
}

const TaskCreationModal = (state: TaskCreationModal) => {
  const store = Store.useStore();
  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (instructions) => {
        let tasks = [];
        for (let i = 0; i < instructions.quantity; i++) {
          for (let e of instructions.emails) {
            tasks.push({
              id: nanoid(5),
              site: instructions.site,
              input: instructions.input,
              email: e,
              proxy: instructions.proxy
            });
          }
        }
        tasks = await ipcRenderer.sendSync('add-tasks', tasks);
        store.set('tasks')(tasks);
        store.set('TaskCreationModal')({ visible: false });
        notification.open({
          message: `Task${tasks.length > 1 ? 's' : ''} successfully created`,
          description: `Created ${tasks.length} task${tasks.length > 1 ? 's' : ''}.`,
          placement: 'bottomRight',
          duration: 2
        })
        form.resetFields();
      })
  }

  return (
    <Modal
      title="Create Task"
      okText="Create"
      centered
      visible={state.visible}
      onOk={onSubmit}
      onCancel={() => { store.set('TaskCreationModal')({ visible: false }) }}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{ modifier: 'public', quantity: 1 }}
      >
        <div className="inline-form-items">
          <Form.Item
            className="inline-form-item"
            name="site"
            label="Website"
            rules={[{ required: true, message: "Please select a website" }]}
          >
            <Select allowClear>
              <Select.Option value="naked">Naked</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="inline-form-item"
            name="input"
            label="Input"
            rules={[{ required: true, message: "Please enter an input value" }]}
          >
            <Input placeholder="url / variant" />
          </Form.Item>
        </div>
        <div className="inline-form-items with-quanity">
          <Form.Item
            className="inline-form-item"
            name="emails"
            label="Email"
            rules={[{ required: true, message: "Please select an email list(s)" }]}
          >
            <Select mode="multiple" allowClear>
              <Select.Option value="Mail Labs (10) fresh">Mail Labs (10) fresh</Select.Option>
              <Select.Option value="Mail Labs (25) aged">Mail Labs (25) aged</Select.Option>
              <Select.Option value="Mail Labs (10) warmed">Mail Labs (10) warmed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="inline-form-item"
            name="proxy"
            label="Proxy"
          >
            <Select allowClear>
              <Select.Option value="Oxy">Oxy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter a quantity" }]}
          >
            <InputNumber />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}