import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {
  Container,
  Button,
  Label,
  Icon,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Input,
  Message,
} from 'semantic-ui-react'
import Avatar from '../../components/common/Avatar/avatar'


class HeaderNav extends Component {

    constructor(props) {
        super(props)
        this.state = {
            balance: '',
            loaded: false,
            avatarProfileId: ''
        }
    }

    componentDidMount() {
        this.loadData().then(() => {
            if(this.props.login) {
            this.getCurrentBalance()
            }
        })
    }

    async loadData() {
    
    }

    async getCurrentBalance() {
        let currentBalance = await this.props.account.balance;
        console.log('first current balance', currentBalance)
        let formattedBalance = (parseFloat(currentBalance)/Math.pow(10, 24)).toFixed(2);
        console.log('currentBalance', (parseFloat(currentBalance)/Math.pow(10, 24)).toFixed(2))
        this.setState({
            balance: formattedBalance
        })
        console.log('Balance: ', this.state.balance)
    }

   render() {
    let { login, loaded, requestSignOut, requestSignIn, accountId, length, handleChange, members, thisMember } = this.props
    console.log('this member nav here', thisMember)
    console.log('accountid header', accountId)
          
    let loginButton = '';
    if (!login) { loginButton = (
        <Button as='div' labelPosition='left' onClick={requestSignIn}>
            <Label as='a' basic pointing='right'>
            Enter the Guild
            </Label>
            <Button icon>
                <Icon name='lock' />
            </Button>
        </Button>
        )
    } else if (login && loaded) { loginButton = (
        <Button as='div' labelPosition='left' onClick={requestSignOut}>
        <Label as='a' basic pointing='right'>
            Sign Out
        </Label>
            <Button>
                {accountId}                  
            </Button>
        </Button>
        )
    }

       return(
        
            <Menu fixed='top' inverted stackable borderless>

                <Link to="/">
                    <Menu.Item header>
                        <Image size='mini' src={require('../../../assets/vpguild-logo.png')} style={{ marginRight: '1.5em' }} />
                        Vital Point Guild
                    </Menu.Item>
                </Link>

                <Menu.Item>
                    <Input className='icon' icon='search' placeholder='Search the Guild...' />
                </Menu.Item>

               
               
                <Menu.Menu position='right'>
                {login? <Menu.Item icon='bell' /> : '' }
                {login?
                    <Dropdown icon='add' floating className='item icon'>
                        <Dropdown.Menu>
                        <Dropdown.Header icon='list ul' content='Submit'/>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='add' text='Submit News' as={Link} to='/submit-news'/>
                            <Dropdown.Divider/>
                        <Dropdown.Header icon='settings' content='Admin'/>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='arrow circle right' text='Admin' as={Link} to='/admin'/>
                            <Dropdown.Item icon='user' text='Members' as={Link} to='/members'/>
                            <Dropdown.Divider/>
                        <Dropdown.Header icon='tags' content='Account'/>
                            <Dropdown.Divider/>
                            <Dropdown.Item icon='user' text='My Published Content' as={Link} to='/user-published-posts'/>
                            <Dropdown.Item icon='user' text='My Draft Content' as={Link} to='/user-draft-posts'/>
                            <Dropdown.Item icon='dollar' href='https://wallet.testnet.near.org' text={`Balance: ${this.state.balance}`} />                         
                            
                        </Dropdown.Menu>
                    </Dropdown>
                    
                : ''}
                    <Menu.Item>
                        {loginButton}
                    </Menu.Item>
                    {login && thisMember?
                    <Menu.Item>
                        <Avatar profileId={thisMember[0]} accountId={accountId} />
                    </Menu.Item>
                    : ''}
                    </Menu.Menu>
            </Menu>
       )
   }
}

export default HeaderNav