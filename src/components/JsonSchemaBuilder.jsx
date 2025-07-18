import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Row, Col, Card, Button, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FieldBuilder from './FieldBuilder';
import JsonPreview from './JsonPreview';

const { Title } = Typography;

const JsonSchemaBuilder = () => {
  const { control, watch, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      fields: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  });

  const watchedFields = watch('fields') || [];
  const [jsonSchema, setJsonSchema] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleFieldsChange = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const generateSchema = (fieldsList) => {
      const schema = {};
      
      fieldsList.forEach(field => {
        if (field.name && field.type) {
          if (field.type === 'nested' && field.children) {
            schema[field.name] = generateSchema(field.children);
          } else if (field.type === 'array') {
            schema[field.name] = [];
          } else {
            const defaultValue = field.type === 'string' ? 'STRING' : 
                               field.type === 'number' ? 'number' : 
                               field.type === 'float' ? 'float' :
                               field.type === 'boolean' ? 'boolean' :
                               field.type === 'objectid' ? 'objectId' :
                               field.type === 'array' ? [] : '';
            schema[field.name] = defaultValue;
          }
        }
      });
      
      return schema;
    };

    setJsonSchema(generateSchema(watchedFields || []));
  }, [watchedFields, updateTrigger]);

  const addField = () => {
    append({ name: '', type: 'string' });
    handleFieldsChange();
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    console.log('Generated Schema:', jsonSchema);
  };

  return (
    <div className="schema-builder">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={24} style={{ height: '100%' }}>
          <Col span={12}>
            <Card 
              title={<Title level={4}>Schema Builder</Title>}
              className="builder-card"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <FieldBuilder
                  control={control}
                  fields={fields}
                  remove={remove}
                  setValue={setValue}
                  getValues={getValues}
                  nestingLevel={0}
                  onFieldsChange={handleFieldsChange}
                />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={addField}
                  style={{ marginTop: '16px' }}
                >
                  Add Field
                </Button>
                <Button 
                  type="default" 
                  htmlType="submit"
                  style={{ marginTop: '8px' }}
                >
                  Submit
                </Button>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              title={<Title level={4}>JSON Preview</Title>}
              className="preview-card"
            >
              <JsonPreview schema={jsonSchema} />
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default JsonSchemaBuilder;