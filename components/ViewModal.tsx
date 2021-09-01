import React, { Component } from "react";
import {
    Modal,
    ModalBody,
    ModalFooter
} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import {
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import ModalHeader from 'react-bootstrap/ModalHeader'
import PermanentDrawerRight from './drawer'


export default class ViewModal extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            edit: false,
            disable: this.props.disableButton,
            priority: 1,
            validation: {title: true, description: true}
        };
    }

    handleChange = (e: any) => {
        let { name, value } = e.target;

        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    handleError = (e: any) => {
        let newVal = this.state.validation
        let { name, value } = e.target;

        const activeItem = { ...this.state.activeItem, [name]: value };
        newVal[name] = true
        this.setState({ activeItem, validation: newVal });
    };
    
    validate = () => {
        let activeItem = this.state.activeItem
        let newVal = this.state.validation
        let canSubmit = true

        if (activeItem.title == '') {
            newVal.title = false
            canSubmit = false
        }
        if (activeItem.description == '') {
            newVal.description = false
            canSubmit = false
        }
        this.setState({validation: newVal})
        return canSubmit
    }

    disableButton = () => {
        this.setState({disable: !this.state.disable})
    }

    editMode = () => {
        this.setState({edit: !this.state.edit, activeItem: this.props.activeItem})
    }

    render() {
        const { activeItem, show, onHide, onEdit, onDelete } = this.props;
        let body;

        if (this.state.edit) {
            body = <Modal show={show} onHide={onHide} backdrop="static" size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>   
            <ModalHeader>Edit Item </ModalHeader>
            <ModalBody>
                    <Form>
                    {!this.state.validation.title ? (
                            <FormControl error>
                            <Label for="title">Title</Label>
                            <Input
                            id="component-error"
                            value={this.state.activeItem.title}
                            name='title'
                            onChange={this.handleError}
                            aria-describedby="component-error-text"
                            />
                            <FormHelperText id="component-error-text">Error!</FormHelperText>
                            </FormControl>
                        ) : 
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input 
                                type="text"
                                name="title"
                                value={this.state.activeItem.title}
                                onChange={this.handleChange}
                                placeholder="Enter Todo Title"
                                />
                            </FormGroup>
                        }
                        {!this.state.validation.description ? (
                            <FormControl error>
                            <Label for="title">Description</Label>
                            <Input
                            id="component-error"
                            value={this.state.activeItem.description}
                            name='description'
                            onChange={this.handleError}
                            aria-describedby="component-error-text"
                            />
                            <FormHelperText id="component-error-text">Error!</FormHelperText>
                            </FormControl>
                        ) : 
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                placeholder="Enter Todo description"
                                value={this.state.activeItem.description}
                                name='description'
                                onChange={this.handleChange}
                                rows={5}
                                />
                            </FormGroup>
                        }
                        <FormGroup>
                            <Label for="description">Priority:</Label>
                            <select 
                            onChange={this.handleChange} 
                            value={this.state.activeItem.priority}
                            name='priority'
                            >
                                {[...Array(5).keys()].map(n => (
                                <option key={n} value={n + 1}>
                                    {n + 1}
                                </option>
                                ))}
                            </select>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button 
                    variant="contained"
                    color="primary" 
                    startIcon={<SaveIcon />} 
                    onClick={() => {
                        if (this.validate()) {
                            onEdit(this.state.activeItem);
                            this.editMode();
                            onHide();
                        }
                        }}>
                        Save
                    </Button>
                </ModalFooter>
                </Modal>
        } else {
            body = <PermanentDrawerRight 
                    show={show} 
                    activeItem={activeItem} 
                    onDelete={onDelete} 
                    onHide={onHide} 
                    onEdit={() => this.editMode()} 
                    />
        }
        return (
            <>
            {body}
            </>
        );
    }
}






