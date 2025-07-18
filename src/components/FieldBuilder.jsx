import { Input, Select, Button, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const FieldBuilder = ({ 
  control, 
  fields, 
  remove, 
  setValue, 
  getValues, 
  nestingLevel = 0,
  parentPath = 'fields',
  onFieldsChange
}) => {
  const addNestedField = (fieldIndex) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    
    if (!updatedFields[fieldIndex].children) {
      updatedFields[fieldIndex].children = [];
    }
    
    updatedFields[fieldIndex].children.push({ 
      name: '', 
      type: 'string'
    });
    
    setValue(parentPath, updatedFields);
    if (onFieldsChange) {
      onFieldsChange();
    }
  };

  const removeNestedField = (fieldIndex, childIndex) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    
    if (updatedFields[fieldIndex].children) {
      updatedFields[fieldIndex].children.splice(childIndex, 1);
      setValue(parentPath, updatedFields);
      if (onFieldsChange) {
        onFieldsChange();
      }
    }
  };

  const handleFieldChange = (fieldIndex, property, value) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    updatedFields[fieldIndex][property] = value;
    
    // If changing to nested type, initialize children array
    if (property === 'type' && value === 'nested' && !updatedFields[fieldIndex].children) {
      updatedFields[fieldIndex].children = [];
    }
    
    setValue(parentPath, updatedFields);
    if (onFieldsChange) {
      onFieldsChange();
    }
  };

  const handleNestedFieldChange = (fieldIndex, childIndex, property, value) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    updatedFields[fieldIndex].children[childIndex][property] = value;
    
    // If changing to nested type, initialize children array
    if (property === 'type' && value === 'nested' && !updatedFields[fieldIndex].children[childIndex].children) {
      updatedFields[fieldIndex].children[childIndex].children = [];
    }
    
    setValue(parentPath, updatedFields);
    if (onFieldsChange) {
      onFieldsChange();
    }
  };

  const addDeeplyNestedField = (fieldIndex, childIndex) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    
    if (!updatedFields[fieldIndex].children[childIndex].children) {
      updatedFields[fieldIndex].children[childIndex].children = [];
    }
    
    updatedFields[fieldIndex].children[childIndex].children.push({
      name: '',
      type: 'string'
    });
    
    setValue(parentPath, updatedFields);
    if (onFieldsChange) {
      onFieldsChange();
    }
  };

  const removeDeeplyNestedField = (fieldIndex, childIndex, grandChildIndex) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    
    if (updatedFields[fieldIndex].children && updatedFields[fieldIndex].children[childIndex].children) {
      updatedFields[fieldIndex].children[childIndex].children.splice(grandChildIndex, 1);
      setValue(parentPath, updatedFields);
      if (onFieldsChange) {
        onFieldsChange();
      }
    }
  };

  const handleDeeplyNestedFieldChange = (fieldIndex, childIndex, grandChildIndex, property, value) => {
    const currentFields = getValues(parentPath) || [];
    const updatedFields = [...currentFields];
    updatedFields[fieldIndex].children[childIndex].children[grandChildIndex][property] = value;
    
    setValue(parentPath, updatedFields);
    if (onFieldsChange) {
      onFieldsChange();
    }
  };

  const currentFields = getValues(parentPath) || [];

  return (
    <div className="field-builder">
      {currentFields.map((field, index) => (
        <div 
          key={index} 
          className="field-item" 
          data-type={field.type || 'string'}
          style={{ marginLeft: nestingLevel * 20 }}
        >
          <div className="field-row">
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Field name"
                value={field.name || ''}
                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                style={{ width: '40%' }}
              />
              <Select
                placeholder="Select type"
                value={field.type || 'string'}
                onChange={(value) => handleFieldChange(index, 'type', value)}
                style={{ width: '30%' }}
              >
                <Option value="string">String</Option>
                <Option value="number">Number</Option>
                <Option value="float">Float</Option>
                <Option value="boolean">Boolean</Option>
                <Option value="objectid">Object ID</Option>
                <Option value="array">Array</Option>
                <Option value="nested">Nested</Option>
              </Select>
              <div className="field-controls">
                <span className="field-type-badge">{field.type || 'string'}</span>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    remove(index);
                    if (onFieldsChange) {
                      onFieldsChange();
                    }
                  }}
                  danger
                  size="small"
                />
              </div>
            </Space.Compact>
          </div>

          {field.type === 'nested' && (
            <div className="nested-fields">
              {field.children && field.children.map((child, childIndex) => (
                <div key={childIndex} className="nested-field-item">
                  <div className="field-row">
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        placeholder="Field name"
                        value={child.name || ''}
                        onChange={(e) => handleNestedFieldChange(index, childIndex, 'name', e.target.value)}
                        style={{ width: '40%' }}
                      />
                      <Select
                        placeholder="Select type"
                        value={child.type || 'string'}
                        onChange={(value) => handleNestedFieldChange(index, childIndex, 'type', value)}
                        style={{ width: '30%' }}
                      >
                        <Option value="string">String</Option>
                        <Option value="number">Number</Option>
                        <Option value="float">Float</Option>
                        <Option value="boolean">Boolean</Option>
                        <Option value="objectid">Object ID</Option>
                        <Option value="array">Array</Option>
                        <Option value="nested">Nested</Option>
                      </Select>
                      <div className="field-controls">
                        <span className="field-type-badge">{child.type || 'string'}</span>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeNestedField(index, childIndex)}
                          danger
                          size="small"
                        />
                      </div>
                    </Space.Compact>
                  </div>

                  {child.type === 'nested' && child.children && (
                    <div className="deeply-nested-fields">
                      {child.children.map((grandChild, grandChildIndex) => (
                        <div key={grandChildIndex} className="nested-field-item">
                          <div className="field-row">
                            <Space.Compact style={{ width: '100%' }}>
                              <Input
                                placeholder="Field name"
                                value={grandChild.name || ''}
                                onChange={(e) => handleDeeplyNestedFieldChange(index, childIndex, grandChildIndex, 'name', e.target.value)}
                                style={{ width: '40%' }}
                              />
                              <Select
                                placeholder="Select type"
                                value={grandChild.type || 'string'}
                                onChange={(value) => handleDeeplyNestedFieldChange(index, childIndex, grandChildIndex, 'type', value)}
                                style={{ width: '30%' }}
                              >
                                <Option value="string">String</Option>
                                <Option value="number">Number</Option>
                                <Option value="float">Float</Option>
                                <Option value="boolean">Boolean</Option>
                                <Option value="objectid">Object ID</Option>
                                <Option value="array">Array</Option>
                                <Option value="nested">Nested</Option>
                              </Select>
                              <div className="field-controls">
                                <span className="field-type-badge">{grandChild.type || 'string'}</span>
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeDeeplyNestedField(index, childIndex, grandChildIndex)}
                                  danger
                                  size="small"
                                />
                              </div>
                            </Space.Compact>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => addDeeplyNestedField(index, childIndex)}
                        size="small"
                        style={{ marginTop: '8px', marginLeft: '20px' }}
                      >
                        Add Nested Field
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => addNestedField(index)}
                size="small"
                style={{ marginTop: '8px', marginLeft: '20px' }}
              >
                Add Nested Field
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FieldBuilder;