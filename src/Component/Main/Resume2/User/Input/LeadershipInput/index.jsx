import React, {Component, Fragment} from 'react';
import {Button, Col, Form, Input, Row} from "antd";
import {LeftOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import Editor from "../../Editor";
import BraftEditor from 'braft-editor'




class LeadershipInput extends Component {
    state={
        content: BraftEditor.createEditorState(null),
        outputHTML: '<p></p>',
    }

    goBack = (section) =>{
        return ()=>{
            this.props.showInputChange(section)
        }
    }

    handleContent = (userContent) =>{
        this.setState({
            content: userContent,
            outputHTML: userContent.toHTML()
        })
    }

    render() {
        const { editorState, outputHTML } = this.state
        return (
            <Fragment >
                <Button onClick={this.goBack("default")} icon={<LeftOutlined />}  style={{boxShadow: 2}}/>
                <Row>
                    <Col span={24}>
                        <Form
                            size='middle'
                            layout="vertical"
                            style={{ marginLeft: 40, marginRight: 40}}
                            wrapperCol={{span: 24}}
                        >
                            <Row >
                                <Col span={24}>
                                    <Form.Item label="Organization/Club:">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Role" >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={10} offset={4}>
                                    <Form.Item label="Location:">
                                        <Input/>
                                        <div dangerouslySetInnerHTML={{__html: outputHTML}}/>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Start Date:">
                                        <Input placeholder="Ex: Spring 2020"/>
                                    </Form.Item>
                                </Col>
                                <Col span={10} offset={4}>
                                    <Form.Item label="End Date">
                                        <Input placeholder="Ex: Fall 2024"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Editor handleContent={this.handleContent}/>
                            <Row span={24}>
                                <Col span={12}>
                                    <Button type="primary" style={{marginBottom: 10, marginTop: 10}}>Save</Button>
                                </Col>

                                <Col span={12} style={{textAlign: "right"}}>
                                    <Button type="danger" style={{marginBottom: 10, marginTop: 10}}>Delete</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default LeadershipInput;
