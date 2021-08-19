import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
})

class TransactionPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bank_transfer: false,
      vendor_email: '',
      bill_me_date: Date.now(),
      amount: '',
      card_number: '',
      expiry_date: Date.now(),
      cvv: '',
      account_number: '',
      routing_number: '',
      errors: []
    }
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSwitch(){
    this.setState({bank_transfer: !this.state.bank_transfer})
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(){
    const url = '/transactions'
    const payload = {
      is_bank: this.state.bank_transfer,
      vendor_email: this.state.vendor_email,
      bill_me_date: this.state.bill_me_date,
      amount: this.state.amount
    }
    if(this.state.bank_transfer){
      payload.account_number = this.state.account_number
      payload.routing_number = this.state.routing_number
    } else{
      payload.credit_card = this.state.card_number
      payload.cvv = this.state.cvv
      payload.expiry_date = this.state.expiry_date
    }
    var self = this;
    axios.post(url, payload)
      .then(function (response) {
        console.log('registration successful')
        window.location = response.request.responseURL
      })
      .catch(function (error) {
        let temp_errors = [];
        var errors = error.response.data
        for (const key of Object.keys(errors)){
          temp_errors.push(`Something is wrong with ${key}: ${errors[key]}`)
        }
        console.log(temp_errors)
        self.setState({errors: temp_errors})
      })
    event.preventDefault()
  }


  render () {
    const { classes } = this.props
    let payment;
    if(this.state.bank_transfer){
      payment = 
      <Box className={classes.form}>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='credit_card'
              label='Account Number'
              name='account_number'
              type='number'
              autoComplete='AccountNumber'
              value={this.state.account_number}
              onChange={this.handleChange}
              autoFocus
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='routing_number'
              label='Routing Number'
              value={this.state.routing_number}
              onChange={this.handleChange}
              name='routing_number'
              autoComplete='routing_number'
            />
      </Box>
    } else{
      payment =
      <Box className={classes.form}>
        <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='card_number'
              label='Card Number'
              type='number'
              id='card_number'
              value={this.state.card_number}
              onChange={this.handleChange}
          />
        <TextField
          id="date"
          label="Expiration Date"
          type="month"
          name='expiry_date'
          className={classes.textField}
          value={this.state.expiry_date}
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="standard-number"
          label="CVV"
          type="tel"
          name='cvv'
          onChange={this.handleChange}
          value={this.state.cvv}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ maxLength: 3, }}
        />
      </Box>
    }
    
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AttachMoneyIcon />
          </Avatar>
          <Box align='center'>
            <Typography component='h1' variant='h5'>
              Transaction Information
            </Typography>
            <form className={classes.form} onSubmit={this.handleSubmit}>
              <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='vendor_email'
                    label='Merchant'
                    value={this.state.vendor_email}
                    onChange={this.handleChange}
                />
              <TextField
                id="date"
                label="Bill Me Date"
                type="date"
                value={this.state.expiry_date}
                className={classes.textField}
                name='bill_me_date'
                value={this.state.bill_me_date}
                onChange={this.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="standard-number"
                label="Amount"
                type="number"
                name='amount'
                onChange={this.handleChange}
                value={this.state.amount}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Box mt={5} align='center'>
                <Typography component='h1' variant='h5' >
                  Payment Information
                </Typography>
                <Container display='flex' align='center' >
                  Credit Card
                  <Switch
                    checked={this.state.bank_transfer}
                    onChange={this.handleSwitch}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  Bank Transfer
                </Container>
              </Box>
              {payment}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
              >
                Submit Transaction
        </Button>
            </form>
          </Box>
        </div>
        <Box>
          {(this.state.errors.length > 0) ? <h5>Errors:</h5> : ''}
          {this.state.errors.map((el,index)=> {return <p key={index}>{el}</p>})}
        </Box>
      </Container>
    )
  }
}

TransactionPage.propTypes = {
  classes: PropTypes.any
}

export default withStyles(styles, { withTheme: true })(TransactionPage)