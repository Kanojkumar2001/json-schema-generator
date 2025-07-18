import { useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import JsonSchemaBuilder from './components/JsonSchemaBuilder';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          JSON Schema Builder
        </Title>
      </Header>
      <Content className="app-content">
        <JsonSchemaBuilder />
      </Content>
    </Layout>
  );
}

export default App;