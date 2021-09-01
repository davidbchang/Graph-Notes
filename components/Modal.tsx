import React, { Component } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label

} from "reactstrap";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';


export default class CustomModal extends Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            priority: 1,
            validation: {title: true, description: true}
        };
    }

    handleChange = (e: any) => {
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    handleError = (e: any) => {
        let newVal = this.state.validation
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
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

    render() {
        const { toggle, onSave, onDelete } = this.props;

        return (
            <Modal isOpen={true} toggle={toggle} >
                <ModalHeader toggle={toggle}>New Task</ModalHeader>
                <ModalBody>
                    <Form>
                        {!this.state.validation.title ? (
                            <FormGroup>
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
                            </FormGroup>
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
                            <FormGroup>
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
                            </FormGroup>
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
                            onSave(this.state.activeItem)
                        }
                        }}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

