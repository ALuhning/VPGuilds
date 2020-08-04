import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Header, Card } from 'semantic-ui-react';
import MemberCard from './MemberCard/memberCard';

import './members.css';

class Members extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            running: true,
            user: '',
            role: '',
            roles: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData().then(() => {
            this.setState({loaded:true})
        })
    }

    async loadData() {
       // let memberList = await this.props.contract.listMembers();
       // console.log('existingAccounts', memberList)
       
    }

    handleUserChange = (event) => {
        let value = event.target.value;
        this.setState({ user: value })
        this.props.handleChange({ name: "user", value })
    }

    handleRoleChange = async (event, {value }) => {
        console.log('value', value)
        this.setState({ role: value })
        await this.props.handleChange({ name: "role", value })
        console.log('admin props :', this.props)
        let {user, role, contract } = this.props
        console.log("**user", user, "**role", role)
        await contract.changeUserRole({
            user: user,
            role: role,
        }, process.env.DEFAULT_GAS_VALUE).then(response => {
            console.log("changing role", response)
            this.setState({running:false})
        }).catch(err => {
            console.log(err);
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
            this.props.handleChange({ name: 'user', value: this.state.user})
            this.props.handleChange({ name: 'role', value: this.state.role})

            console.log('admin props :', this.props)
            let {user, role, handleChange, contract, roles } = this.props
            console.log("**user", user, "**role", role)
            contract.registerUserRole({
                user: user,
                role: role,
            }, process.env.DEFAULT_GAS_VALUE).then(response => {
                console.log("assigning role", response)
                let role = response
                let newRoles = roles.concat(role)
                console.log(newRoles);
                handleChange({ name: "roles", value: newRoles })
                this.setState({running:false})
            }).catch(err => {
                console.log(err);
            })
    }

    render() {
        let { role } = this.state
        if (this.state.loaded === false) {
            return <div>Loading...</div>
        } else {


        let { members, login, load, handleChange, contract, near, wallet } = this.props
        console.log('memberlist members ', members)
       // if (load && !login) {return <Redirect to="/" />}
        let Members = 'loading'
       // if (members && members.length === 0) { return <Redirect to="/log" /> }
        
        if (members.length > 0) {
            Members = members.map(member => {
                
                return (
                        <MemberCard
                            key={member[0]}
                            memberId={member[0]}
                            memberAccount={member[1]}
                            memberRole={member[2]}
                            memberJoinDate={member[3]}
                            contract={contract}
                            members={members}
                            handleChange={handleChange}
                            near={near}
                            wallet={wallet}
                            />
                    )
            })
        }    
    
        return (
            <Container className="main">
                <Header as='h1'>Guild Members</Header>
                <Card.Group>
                 {Members}
                </Card.Group>
            </Container>
           
        )
    }
    }
}

export default withRouter(Members)