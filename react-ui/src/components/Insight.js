import React, { useState } from "react";
import { Input, Button, Row, Col, Form, message, Modal  } from 'antd';
import axios from 'axios';
import "./style.css";
const { TextArea } = Input;

function Insight() {
  const [form] = Form.useForm();
  const [answer, setAnswer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/analyze_query', {
        question: values.question,
        context: values.context
      });
      message.success('Fetched Answer Successfully!')
      setAnswer(response.data.answer);
      setIsModalOpen(true)
    } catch (error) {
      message.error('An error occurred while fetching the answer.');
    }
  };

  return (
    <>
      <h1 className="text-heading">Intersight</h1>
      <hr />
      <br />

      <div className="box">
        <Form
          form={form}
          layout="vertical"
          size="medium"
          name="create-health-plan"
          onFinish={onSubmit}
        >
          <Row gutter={24} className="align-fields">
            <Col xs={22} sm={22} md={22} lg={22}>
              <Form.Item
                name="question"
                label="Question"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="align-fields">
            <Col xs={22} sm={22} md={22} lg={22}>
              <Form.Item
                name="context"
                label="Context (For Hugging Face)"
                rules={[{ required: true }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" size="medium" className="right-button">
            Submit
          </Button>
        </Form>
      </div>
      <Modal title="Answer:" closeIcon={true} open={isModalOpen} onCancel={()=>setIsModalOpen(false)} footer={[]} centered width={500}>
      {answer && (
          <div className="answer-box">
            <p>{answer}</p>
          </div>
        )}
        </Modal>
    </>
  );
}

export default Insight;
