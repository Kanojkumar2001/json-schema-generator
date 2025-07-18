import { Typography } from 'antd';

const { Text } = Typography;

const JsonPreview = ({ schema }) => {
  return (
    <div className="json-preview">
      <pre className="json-code">
        {JSON.stringify(schema, null, 2)}
      </pre>
    </div>
  );
};

export default JsonPreview;