import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Form,
  InputNumber,
  Button,
  Checkbox,
  Row,
  Col,
  Divider,
  Card,
  Upload,
  Input,
  Table,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";

import { Descartes2SKU } from "descartes-sku.js";
import './index.css'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">Upload</div>
  </div>
);

const attrs = [
  {
    key: "color",
    title: "颜色",
    value: [
      { key: "金色", value: 1 },
      { key: "粉色", value: 2 },
      { key: "银色", value: 3 },
    ],
  },
  {
    key: "size",
    title: "容量",
    value: [
      { key: "16G", value: 1 },
      { key: "32G", value: 2 },
      { key: "64G", value: 3 },
    ],
  },
  {
    key: "season",
    title: "季节",
    value: [
      { key: "春季", value: 1 },
      { key: "夏季", value: 2 },
      { key: "秋季", value: 3 },
      { key: "冬季", value: 3 },
    ],
  },
];

const Demo = (props) => {
  const [form] = Form.useForm();
  const attrNames = attrs.map((item) => item.key);
  const attrTitles = attrs.map((item) => item.title);

  // skus 数据
  const [skus, setSkus] = useState([
    { color: "金色", size: "32G", season:"秋季",  price: 12, salePrice: 30, count: 100 },
    { color: "银色", size: "32G", season:"秋季",  price: 12, salePrice: 30, count: 100 },
  ]);

  const refresh = () => {
    const descartes2 = new Descartes2SKU(
      Object.values(form.getFieldsValue(attrNames))
    );
    const _attrs = descartes2.descartes();

    const skus = _attrs.map(([...rest]) => {
      const ret = {};
      attrNames.forEach((item, index) => (ret[item] = rest[index]));
      return ret;
    });
    form.setFieldsValue({
      skus,
    });
    setSkus(skus);
  };

  const onFinish = (values) => {
    console.log(form.getFieldsValue(attrNames))
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={{
        size: ['32G'],
        color: ['金色', '银色'],
        season: ['秋季'],
        skus,
      }}
    >
      {attrs.map((attr) => {
        return (
          <Form.Item key={attr.key} name={attr.key} label={attr.title}>
            <Checkbox.Group>
              <Row>
                {attr.value.map((val) => {
                  return (
                    <Col span={8} key={val.key}>
                      <Checkbox value={val.key} style={{ lineHeight: "32px" }}>
                        {val.key}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        );
      })}

      <Form.Item label="skus">
        <Form.List name="skus">
          {(fields, { add, remove }) => {
            return (
              <div className="ant-table ant-table-small ant-table-bordered">
                <div className="ant-table-container">
                  <div className="ant-table-content">
                    <table style={{ tableLayout: "auto" }}>
                      <thead className="ant-table-thead">
                        <tr>
                          {attrTitles.map((item) => (
                            <th key={item} className="ant-table-cell">{item}</th>
                          ))}
                          <th className="ant-table-cell">图片</th>
                          <th className="ant-table-cell">成本价</th>
                          <th className="ant-table-cell">销售价</th>
                          <th className="ant-table-cell">库存</th>
                          <th className="ant-table-cell">操作</th>
                        </tr>
                      </thead>
                      <tbody className="ant-table-tbody">
                        {fields.map((field, index) => {
                          return (
                            <tr key={field.key} gutter={20} align="middle">
                              {attrNames.map((item) => {
                                return (
                                  <td className="ant-table-cell" key={`${field.key}${item}`}>
                                    <Form.Item
                                      style={{ marginBottom: 0 }}
                                      fieldKey={[field.fieldKey, item]}
                                    >
                                      {skus[field.fieldKey] &&
                                        skus[field.fieldKey][item]}
                                    </Form.Item>
                                  </td>
                                );
                              })}

                              {/*图片*/}
                              <td>
                                <Form.Item
                                  name={[field.name, "pic"]}
                                  fieldKey={[field.fieldKey, "pic"]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Upload
                                    action="/upload.do"
                                    listType="picture-card"
                                  >
                                    {uploadButton}
                                  </Upload>
                                </Form.Item>
                              </td>
                              {/*成本价*/}
                              <td className="ant-table-cell">
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  name={[field.name, "price"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "成本价是必填字段",
                                    },
                                    {
                                      type: "number",
                                      message: "价格是一个数字",
                                    },
                                  ]}
                                  fieldKey={[field.fieldKey, "price"]}
                                >
                                  <InputNumber placeholder="成本价" />
                                </Form.Item>
                              </td>
                              {/* 销售价 */}
                              <td className="ant-table-cell">
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  name={[field.name, "salePrice"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "销售价是必填字段",
                                    },
                                    {
                                      type: "number",
                                      message: "销售价是一个数字",
                                    },
                                  ]}
                                  fieldKey={[field.fieldKey, "salePrice"]}
                                >
                                  <InputNumber placeholder="销售价" />
                                </Form.Item>
                              </td>
                              {/* 库存 */}
                              <td className="ant-table-cell">
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  name={[field.name, "count"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "库存是必填字段",
                                    },
                                    {
                                      type: "number",
                                      message: "库存是一个数字",
                                    },
                                  ]}
                                  fieldKey={[field.fieldKey, "count"]}
                                >
                                  <InputNumber placeholder="库存" />
                                </Form.Item>
                              </td>
                              {/* 删除 */}
                              <td className="ant-table-cell">
                                <Form.Item style={{ marginBottom: 0 }}>
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                  />
                                </Form.Item>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }}
        </Form.List>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          span: 12,
          offset: 6,
        }}
      >
        <Button onClick={refresh}>刷新列表</Button>
        <Divider type="vertical" />
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

ReactDOM.render(<Demo />, document.getElementById("container"));
