import React, {Component, Fragment} from 'react';
import {Button, Col, Form, Input, notification, Row, message, Modal} from "antd";
import {LeftOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import Editor from "../../Editor";
import BraftEditor from 'braft-editor'
import { v4 as uuidv4 } from 'uuid';
import ExperienceAction from "../../ExpericenAction";
import {connect} from "react-redux";
import {
    addExperienceSectionInfo,
    deleteExperienceSectionInfo,
    updateExperienceSectionInfo
} from "../../../../../../redux/actions/userSection_action";
import axios from "axios";




class EducationInput extends Component {
    state={
        curSectionId:"",
        infoId: "",
        project: "",
        role: "",
        location:"",
        stateDate: "",
        endDate: "",
        infoIdListLength: 0,
        curInfoId: "",
        content:  BraftEditor.createEditorState(null),
        save: true,
        isModalVisible: false
    }

    componentDidMount() {
        const targetSectionId = this.props.experienceState.experiences[this.props.currentId].sectionId
        const infoIdList = this.props.experienceState.sections[targetSectionId].infoIdList;
        const firstInfoId = this.props.experienceState.sections[targetSectionId].infoIdList[0];
        const firstSectionInfo = this.props.experienceState.information[firstInfoId]
        //send the id and targetSection to input section to initialize the first section
        this.setState(
            { infoId: firstSectionInfo.infoId,
                project: firstSectionInfo.project,
                role: firstSectionInfo.role,
                location: firstSectionInfo.location,
                startDate: firstSectionInfo.startDate,
                endDate: firstSectionInfo.endDate,
                infoIdListLength: infoIdList.length,
                curInfoId: firstInfoId,
                content:  BraftEditor.createEditorState(firstSectionInfo.HTMLContent)
            }
        )
    }

    handleOk = () =>{
        this.updateGeneralInfo()
        this.setState({save: true, isModalVisible: false}, ()=>{
            this.goBack("default")
        })
    }

    handleCancel = ()=>{
        this.setState({save: true, isModalVisible: false }, ()=>{
            this.goBack("default")
        })
    }

    goBack = (section) =>{
        return () => {
            if(this.state.save) {
                this.props.showInputChange(section)
            }else{
                this.setState({isModalVisible: true})
            }
        }
    }

    handleContent = (userContent) =>{
        this.setState({
            content: userContent,
            save: false
        })
        const HTMLContent = userContent.toHTML();
        const h = {infoId: this.state.infoId, type: "HTMLContent", value: HTMLContent}
        this.props.updateExperienceSectionInfo(h)

    }

    handleInformation = (curInfoId, targetInfo) =>{
        const targetSectionId = this.props.experienceState.experiences[this.props.currentId].sectionId
        const infoIdList = this.props.experienceState.sections[targetSectionId].infoIdList;
        this.setState(
            { infoId: targetInfo.infoId,
                project: targetInfo.project,
                role: targetInfo.role,
                location: targetInfo.location,
                startDate: targetInfo.startDate,
                endDate: targetInfo.endDate,
                infoIdListLength: infoIdList.length,
                curInfoId: curInfoId,
                content:  BraftEditor.createEditorState(targetInfo.HTMLContent),
                save: false
            }
        )
    }


    deleteInputSection = ()=>{
        this.setState({save: true})
        const targetInfoObj = {experienceId: this.props.currentId, infoId: this.state.infoId}
        let api = global.AppConfig.serverIP + "/resume/deleteInfo"
        const data = {infoId: this.state.infoId}
        axios.post(api,data).then((result)=>{
            this.props.deleteExperienceSectionInfo(targetInfoObj).then(()=> {
                const targetSectionId = this.props.experienceState.experiences[this.props.currentId].sectionId
                const firstElementAfterDeleted = this.props.experienceState.sections[targetSectionId].infoIdList[0];
                const targetSectionInfo = this.props.experienceState.information[firstElementAfterDeleted]
                this.handleInformation(firstElementAfterDeleted, targetSectionInfo)
            })
        })
    }

    addInputSection = () =>{
        const infoId = uuidv4();
        const targetSectionId = this.props.experienceState.experiences[this.props.currentId].sectionId
        const data = {sectionId: targetSectionId, id: infoId + "", information: {infoId: infoId + "", project: "", role: "", location: "",
                startDate:"", endDate: "", HTMLContent: "", name: "", telephone: "", email:"", personalLocation: "", other: ""
            }}
        let api = global.AppConfig.serverIP + "/resume/addSectionInfo"
        axios.post(api, data).then(()=>{
            this.props.addExperienceSectionInfo(data)
        })
    }

    // changing the information while user's typing
    onInputChange = (type, e) =>{
        this.setState({[type]: e.target.value, save: false})
        const infoObj = {infoId: this.state.infoId, type: type, value: e.target.value}
        this.props.updateExperienceSectionInfo(infoObj)
    }


    success = () => {
        message.success('Success');
    }

    error = () => {
        message.error('Fail');
    };

    updateGeneralInfo = ()=>{
        let api = global.AppConfig.serverIP + "/resume/updateGeneralInfo"
        const data = this.props.experienceState.information[this.state.infoId];
        axios.post(api, data).then((result)=>{
          this.success()
            this.setState({save: true})
        }).catch(()=>{
            this.error()
            this.setState({save: true})
        })
    }

    render() {
        return (
            <Fragment >
                <Row style={{display: "line block"}} span={24}>
                    <Col span={2}>
                        <Button onClick={this.goBack("default")} icon={<LeftOutlined />}  style={{boxShadow: 2}}/>
                    </Col>
                    <Col span={20} style={{textAlign: "center"}}>
                        <ExperienceAction
                            handleInformation={this.handleInformation}
                            addInputSection={this.addInputSection}
                            curInfoId={this.state.curInfoId}
                            currentId={this.props.currentId}
                            currentSection={"education"}
                        />
                    </Col>
                    <Col span={2}/>
                </Row>
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
                                    <Form.Item label="School:">
                                        <Input
                                            onChange={(e)=>this.onInputChange("project", e)}
                                            value={this.state.project}/>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Major:" >
                                        <Input
                                            onChange={(e)=>this.onInputChange("role", e)}
                                            value={this.state.role}/>
                                    </Form.Item>
                                </Col>
                                <Col span={10} offset={4}>
                                    <Form.Item label="Location:">
                                        <Input
                                            onChange={(e)=>this.onInputChange("location", e)}
                                            value={this.state.location}/>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label="Start Date:">
                                        <Input placeholder="Ex: Spring 2020"
                                               onChange={(e)=>this.onInputChange("startDate", e)}
                                               value={this.state.startDate}/>
                                    </Form.Item>
                                </Col>
                                <Col span={10} offset={4}>
                                    <Form.Item label="End Date">
                                        <Input placeholder="Ex: Fall 2024"
                                               onChange={(e)=>this.onInputChange("endDate", e)}
                                               value={this.state.endDate}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Editor content={this.state.content} handleContent={this.handleContent}/>
                            <Row span={24}>
                                <Col span={12}>
                                <Button type="primary" style={{marginBottom: 10, marginTop: 10}} onClick={(e)=>this.updateGeneralInfo()}>Save</Button>
                                </Col>

                                <Col span={12} style={{textAlign: "right"}}>
                                    <Button type="danger"
                                            disabled={this.state.infoIdListLength === 1}
                                            onClick={(e)=>this.deleteInputSection()}
                                            style={{marginBottom: 10, marginTop: 10}}
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Modal destroyOnClose visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <p>save the content before you leave</p>
                </Modal>
            </Fragment>
        );
    }
}

export default connect(
    state => ({experienceState: state.experienceInfoReducer}),
    {
        updateExperienceSectionInfo: updateExperienceSectionInfo,
        deleteExperienceSectionInfo: deleteExperienceSectionInfo,
        addExperienceSectionInfo: addExperienceSectionInfo,
    }
)(EducationInput);
