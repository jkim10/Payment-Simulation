import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import AccountCircle from '@material-ui/icons/AccountCircle';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
})

class Navbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      auth: false,
      name: '',
      email: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
    if(this.state.auth){
      const link = document.createElement('a');
      link.setAttribute('href', '/logout');
      link.setAttribute('rel', 'nofollow');
      link.setAttribute('data-method', 'delete');
      document.body.appendChild(link);
      link.click();
    } else{
      const link = document.createElement('a');
      link.setAttribute('href', '/sign_in');
      link.setAttribute('rel', 'nofollow');
      link.setAttribute('data-method', 'get');
      document.body.appendChild(link);
      link.click();
    }
  }
  componentDidMount(){
    console.log(this.props.vendor)
    if(this.props.vendor){
      this.setState({auth: true, name: this.props.vendor.name, email: this.props.vendor.email});
    }
  }
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
      
      <FormGroup >
        <FormControlLabel
          control={<Switch checked={this.state.auth} onChange={(event) => this.handleChange(event)} aria-label="login switch" />}
          label={this.state.auth ? 'Logout' : 'Login'}
        />
      </FormGroup>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {this.state.auth && `Logged in as: ${this.state.name || this.state.email}`}
          </Typography>
          <Button color="inherit" href='/'>Home</Button>
          {this.state.auth && <Button href='/portal' color="inherit"><AccountCircle /></Button>}
        </Toolbar>
      </AppBar>
    </div>
    )
  }
}

Navbar.propTypes = {
  classes: PropTypes.any
}

export default withStyles(styles, { withTheme: true })(Navbar)