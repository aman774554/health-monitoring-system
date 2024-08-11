import React, { useState, useEffect } from "react";
import { Select, Row, Col, Card } from 'antd';
import axios from 'axios';
import './style.css';

function UsersData() {
    const { Option } = Select;
    const [userNames, setUserNames] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/user_names')
            .then(response => {
                setUserNames(response.data);
            })
            .catch(error => {
                console.error('Error fetching user names:', error);
            });
    }, []);

    const handleUserSelect = (value) => {
        axios.post('http://localhost:5000/api/user_data', { user_name: value })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    return (
        <>
            <h1 className="text-heading">Users Data</h1>
            <hr />
            <br />
            <Row gutter={24} className="align-fields">
                <Col xs={22} sm={11} md={11} lg={11}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Select a User"
                        allowClear
                        onSelect={handleUserSelect}
                    >
                        {userNames.map((userName,index) => (
                            <Option key={`${userName}+${index}`} value={userName}>{userName}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <br/>
            {userData && (
                <Row gutter={24} className="align-fields">
                    <Col xs={22} sm={11} md={11} lg={11}>
                        <Card title={userData?.name}>
                            <p><strong>Age:</strong> {userData?.age}</p>
                            <p><strong>Goals:</strong> {userData?.goals}</p>
                            <p><strong>Health Plans:</strong></p>
                            <ul>
                                <li>{userData?.health_plans?.plan1}</li>
                                <li>{userData?.health_plans?.plan2}</li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    )
}

export default UsersData;