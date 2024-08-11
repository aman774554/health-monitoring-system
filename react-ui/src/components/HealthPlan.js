import React, { useState } from "react";
import { Row, Col, Button, Form, Input, InputNumber, Select, message, Modal } from 'antd';
import axios from 'axios';
import './style.css';

function HealthPlan() {
    const [form] = Form.useForm();
    const [plan, setPlan] = useState([]);
    const { Option } = Select;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/personalized_plan', {
                name: values.name,
                age: values.age,
                goals: values.goals
            });
            setPlan(response.data);
            message.success('Health plan generated successfully!');
            setIsModalOpen(true)
        } catch (error) {
            message.error('An error occurred while fetching the personalized plan.');
        }
    };

    return (
        <>
            <h1 className="text-heading">Health Plan</h1>
            <hr/>
            <br/>
            <div className="box">
                <Form
                    form={form}
                    layout="vertical"
                    size="medium"
                    name="create-health-plan"
                    onFinish={onSubmit}
                >
                    <Row gutter={24} className="align-fields">
                        <Col xs={22} sm={11} md={11} lg={11}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={22} sm={11} md={11} lg={11}>
                            <Form.Item
                                name="age"
                                label="Age"
                                rules={[{ required: true }]}
                            >
                                <InputNumber style={{width:"100%"}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} className="align-fields">
                        <Col xs={22} sm={22} md={22} lg={22}>
                            <Form.Item
                                name="goals"
                                label="Goals"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select a Goal" allowClear>
                                    <Option value="general health">General Health</Option>
                                    <Option value="weightLoss">Weight Loss</Option>
                                    <Option value="muscleGain">Muscle Gain</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit" size="medium" className="right-button">
                        Submit
                    </Button>
                </Form>
            </div>
            <Modal closeIcon={true} open={isModalOpen} onCancel={()=>setIsModalOpen(false)} footer={[]} centered width={500}>
            {Object.keys(plan).length > 0 && (
                    <div>
                        <h3>Personalized Health Plan:</h3>
                        <ul>
                        <li><p>{plan.plan1}</p></li>
                        <li><p>{plan.plan2}</p></li>
                        </ul>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default HealthPlan;