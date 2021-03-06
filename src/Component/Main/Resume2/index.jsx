import React, {Component, Fragment} from 'react';
import {Button, Col, message, Row, Spin} from "antd";
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import GeneralInfo from "./GeneralInfo"
import BasicInfo from "./BasicInfo";
import SummaryInfo from "./SummaryInfo";
import Section from "./User/Section"
import PersonalInput from "./User/Input/PersonalInput";
import ProjectInput from "./User/Input/ProjectInput";
import EducationInput from "./User/Input/EducationInput";
import SummaryInput from "./User/Input/SummaryInput";
import CustomInput from "./User/Input/CustomInput";
import LeadershipInput from "./User/Input/LeadershipInput";
import {connect} from "react-redux";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import axios from "axios";
import "./index.css";
import {initialExperienceState, updateModuleAction} from "../../../redux/actions/userSection_action";



const resumeScale = 794 / 1920;
class Resume2 extends Component {
    state = {
        height: 895,
        width: 794,
        scale: 0.65,
        firstTime: true,
        inputNum: 1,
        sectionType: "default",
        currentSectionId: "",
        curResumeId: "",
        title: "",
        load: false
    }
    //handle windows change
    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        const resumeId = this.props.location.state.resumeId
        const title = this.props.location.state.title
        let api = global.AppConfig.serverIP + "/resume/getModule"
        this.setState({load: true}, ()=>{
            axios.post(api, {resumeId: resumeId}).then((result)=>{
                    const data = result.data
                    const newExperience = {experiences: {}, sections: {}, information: {}}
                    newExperience.experiences = data.experience;
                    newExperience.sections = data.sections;
                    newExperience.information = data.information
                    this.props.initialExperienceState(newExperience)
                    this.props.updateModuleAction(data.module.modules);
                this.setState({curResumeId: resumeId, title: title, load: false})
                }
            ).catch(()=>{
                this.error()
            })
        })
    }

    error = () => {
        message.error('Fail! Please Try Later');
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () =>{
        let newScale, newWidth;
        const  screeWidth = document.documentElement.clientWidth;
        newWidth = screeWidth / 2;
        newScale =   resumeScale/ (794 / screeWidth);
        if(screeWidth > 1920){
            newScale = 1;
        }
        if(screeWidth < 1024){
            newScale = 0.65
        }
        this.setState({width: newWidth, scale: newScale, firstTime: false})
    }
    //when user click card change it to input
    showInputChange = (section, id)=>{
        this.setState({sectionType: section, currentSectionId: id})
    }

    //present the resume section
    handleResumeSection = (sectionName, id)=>{
       switch (sectionName) {
           // case "education":
           //     return (
           //         <Education key={id} moduleId={id}/>
           //     )
           case "basicInfo":
               return   (
                   <BasicInfo  key={id} moduleId={id}/>
               )
           case "summary":
               return (
                  <SummaryInfo key={id} moduleId={id}/>
               )

           default:
               return (
                   <GeneralInfo key={id} moduleId={id}/>
               )
       }
    }

    handleSection = () =>{

        switch (this.state.sectionType) {
            case "project":
                return (
                    <ProjectInput currentId={this.state.currentSectionId} showInputChange={this.showInputChange} />
                )
            case "education":
                return (
                    <EducationInput currentId={this.state.currentSectionId} showInputChange={this.showInputChange} />
                )
            case "summary":
                return (
                    <SummaryInput currentId={this.state.currentSectionId} showInputChange={this.showInputChange}/>
                )
            case "leadership":
                return (
                    <LeadershipInput currentId={this.state.currentSectionId}  showInputChange={this.showInputChange}/>
                )
            case "custom":
                return (
                    <CustomInput currentId={this.state.currentSectionId} showInputChange={this.showInputChange}/>
                )
            case "basicInfo":
                return (
                    <PersonalInput currentId={this.state.currentSectionId} showInputChange={this.showInputChange}/>
                )
            default:
                return (
                        <Section showInputChange={this.showInputChange} resumeId={this.state.curResumeId}/>
                )
        }

    }


    printDocument = () =>{
        // let title = this.props.resumeState.resumeList[this.state.curResumeId].resumeTitle
        html2canvas(document.getElementById('resume'), {
            allowTaint: true,
            taintTest: false,
            useCORS: true,
            dpi: window.devicePixelRatio * 4,
            scale: 4
        }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 592.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            let PDF = new jsPDF('', 'pt', 'a4')
            if (leftHeight < pageHeight) {
                PDF.addImage(pageData, 'JPEG', 1.2, 1.4, imgWidth, imgHeight)
            } else {
                while (leftHeight > 0) {
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight
                    position -= 841.89
                    if (leftHeight > 0) {
                        PDF.addPage()
                    }
                }
            }
            PDF.save("resume")
        })
    }




    render() {
        return (
            <Fragment>
                {this.state.load === true ? <Row style={{marginTop: 400}} justify={"center"}><Spin/></Row> :
                    <div style={{backgroundColor: "#E7E6E6", zIndex: 0}} className="resume-page-scrollbar" >
                        <Row>
                            <Col span={24}>
                                {/*left part*/}
                                <Row span={24} style={{marginTop: 30}}>
                                    <Col span={3}>
                                    </Col>
                                    <Col span={9}>
                                        <Row>
                                            <Col span={3}>

                                                <Row style={{marginBottom: 20}}>
                                                    <Button type="primary" shape="circle" size="large"
                                                            icon={<CloudDownloadOutlined/>}
                                                            onClick={(e) => this.printDocument()}/>
                                                </Row>
                                            </Col>
                                            <Col span={21}>
                                                <Row>
                                                    <Col span={22} style={{backgroundColor: "white"}}>
                                                        {this.handleSection()}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/*resume*/}
                                    <div className="resume-board" style={{
                                        height: window.innerHeight - 73,
                                        width: this.state.firstTime === false ? this.state.width : (window.innerWidth / 2) - 15
                                    }}
                                    >
                                        <div style={{height: window.innerHeight - 73}}>
                                            <div className="dd" id="resume"
                                                 style={{
                                                     backgroundColor: "white", transformOrigin: "top left",
                                                     transform: [`scale(${this.state.firstTime === false ? this.state.scale : resumeScale / (794 / window.innerWidth)})`]
                                                 }}
                                            >
                                                <div className="resume-spacing">
                                                    {this.props.modulesObj.modules.map((moduleObj) => {
                                                        return this.handleResumeSection(moduleObj.module, moduleObj.id)
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                }
            </Fragment>
        );
    }
}

export default connect(
    state => ({modulesObj: state.moduleReducer, experienceState: state.experienceInfoReducer, resumeState: state.resumeReducer,}),
    {updateModuleAction: updateModuleAction, initialExperienceState: initialExperienceState}
    )(Resume2)
