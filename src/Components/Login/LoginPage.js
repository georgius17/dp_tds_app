import React from 'react';
import { Form, Button, Row } from 'react-bootstrap';

const LoginPage = (props) => {
    return (
        <Row className="justify-content-md-center">
            <Form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Row>
    )

}

export default LoginPage;