import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import update from 'immutability-helper';

import DropdownFilter from '../DropdownFilter/DropdownFilter.js';
import VolunteerEditModal from '../VolunteerEditModal/VolunteerEditModal.js';

export default class VolunteerRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            edit:false,
            volunteer:{}
        };
        this.handleEdit= this.handleEdit.bind(this);
        this.handleHide=this.handleHide.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
        this.handleDelete= this.handleDelete.bind(this);
    }

    handleEdit(){
        this.setState( {edit: true} );
    }

    handleHide(){
        this.setState({edit:false});
    }

    handleSubmit(diff){
        console.log('VolunteerRow.handleSubmit');
        console.log(diff);
        //TODO BUG
        //TODO either row is updated on every submit and then no need for diff merge or an additional send to server phase is added
        this.props.onRowChange(this.props.volunteer.department, this.props.volunteer.profile_id, diff);//TODO include department id in model

        this.setState((state)=>update(state,{ edit:{$set:false} ,volunteer: {$merge: diff}} ));
    }

    handleDelete(){
        console.log('VolunteerRow.handleDelete');
        this.props.onRowDelete(this.props.volunteer.department_id,this.props.volunteer.profile_id);
    }

    
    render() {
        console.log('VolunteerRow.render');
        console.log(this.props.volunteer);
        console.log(this.state.volunteer);

        if (!this.props.volunteer){
            console.log('props.volunteer is falsy. That is a bug');
            return null;
        }
        else {
            let effectiveVolunteer=update(this.props.volunteer,{$merge:this.state.volunteer});
            console.log(effectiveVolunteer);

            return (          
                <tr className="volunteer-row">
                    <VolunteerEditModal 
                        show={!!this.state.edit} 
                        onHide={this.handleHide} 
                        onSubmit={this.handleSubmit}
                        volunteer={effectiveVolunteer}/>
                    <td>{effectiveVolunteer.profile_id}</td>
                    <td>{effectiveVolunteer.email}</td>
                    <td>{effectiveVolunteer.first_name}</td>
                    <td>{effectiveVolunteer.last_name}</td>
                    <td>{effectiveVolunteer.department}</td>
                    <td>{effectiveVolunteer.role}</td>
                    <td>{effectiveVolunteer.is_production?'Yes':'No'}</td>
                    <td>{effectiveVolunteer.phone}</td>
                    <td>{effectiveVolunteer.got_ticket?'Yes':'No'}</td>
                    <td><a href="#" onClick={this.handleEdit}>Edit</a>/<a href="#" onClick={this.handleDelete}>Delete</a></td>
                </tr>
            );
        }
    }
}