// import React from 'react';

// import {
//   Form,
//   Input,
//   Button,
//   Divider
// } from 'antd';

// return (
//   <div className="container full">
//     <Form layout={'vertical'}>
//       <Divider plain>Settings</Divider>
//       <div className="inline-form-items">
//         <Form.Item className="inline-form-item" label="License">
//           <Input
//             addonBefore={<KeyOutlined />}
//             placeholder="License"
//             value={`******************************${settings.license.substr(settings.license.length - 5)}`}
//             disabled
//           />
//         </Form.Item>
//         <Form.Item className="inline-form-item" label="Deactivate License">
//           <Button
//             style={{ width: '100%' }}
//             type="primary"
//             danger
//           >Deactivate
//           </ Button>
//         </Form.Item>
//       </div>
//       <div className="inline-form-items">
//         <Form.Item className="inline-form-item" label="Webhook" name="webhook">
//           <Search
//             addonBefore={<LinkOutlined />}
//             enterButton={<LinkOutlined />}
//             placeholder="Webhook"
//             onChange={onChange}
//             defaultValue={settings.webhook}
//           />
//         </Form.Item>
//       </div>
//       <div className="inline-form-items">
//         <Form.Item className="inline-form-item" label="Monitor Delay" name="monitorDelay">
//           <Input
//             addonBefore={<BranchesOutlined />}
//             defaultValue={settings.monitorDelay}
//             placeholder="1000"
//             onChange={onChange}
//           />
//         </Form.Item>
//         <Form.Item className="inline-form-item" label="Retry Delay" name="retryDelay">
//           <Input
//             addonBefore={<BugOutlined />}
//             defaultValue={settings.retryDelay}
//             placeholder="1000"
//             onChange={onChange}
//           />
//         </Form.Item>
//       </div>
//       <Divider plain>Captcha</Divider>
//       <div className="inline-form-items">
//         <Form.Item className="inline-form-item" label="Autosolve" name="autoSolve">
//           <Search
//             addonBefore={<StopTwoTone twoToneColor="#EB2F49" />}
//             // addonBefore={<CheckCircleTwoTone twoToneColor="#1BE44C" />}
//             defaultValue={settings.webhook}
//             enterButton={<ApiOutlined />}
//             placeholder="accesstoken:apikey"
//             onChange={onChange}
//           />
//         </Form.Item>
//       </div>
//       <div className="inline-form-items">
//         <Form.Item className="inline-form-item" label="2Captcha" name="twoCaptcha">
//           <Input
//             addonBefore={<KeyOutlined />}
//             defaultValue={settings.twoCaptcha}
//             placeholder="API Key"
//             onChange={onChange}
//           />
//         </Form.Item>
//         <Form.Item className="inline-form-item" label="Anti Captcha" name="antiCaptcha">
//           <Input
//             addonBefore={<KeyOutlined />}
//             defaultValue={settings.antiCaptcha}
//             placeholder="API Key"
//             onChange={onChange}
//           />
//         </Form.Item>
//       </div>
//     </Form>
//   </div>
// )