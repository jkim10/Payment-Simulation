import React from 'react'
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import PropTypes from 'prop-types'
import { Typography, CssBaseline, Box, TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
  },
  head:{
    color: 'white'
  }
})

class Portal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      balance: 0,
      payout_balance: 0,
      transactions: [],
      audit_date: '',
      payout_history:[]
    }
    this.handleAudit = this.handleAudit.bind(this);
    this.handlePayout = this.handlePayout.bind(this);
  }

  componentDidMount(){
    const params = {
      vendor_id: this.props.vendor.id
    }
    console.log(params)
    let self = this;
    axios.get('/payout_history', {params: params})
      .then(function (response) {
        self.setState({payout_history: response.data})
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })

    this.setState({
      balance: this.props.vendor.balance,
      transactions: this.props.transactions,
      payout_balance: this.props.vendor.payout_balance,
    })
    console.log(this.props.vendor)
    console.log(this.props.transactions)
  }
  parseDate(string){
    const date = new Date(Date.parse(string))
    return date.toLocaleDateString("en-US")
  }
  handlePayout(event){
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrf
      }
    }
    const payload = {
      vendor_id: this.props.vendor.id,
      payout_date: Date.now()
    }
    axios.post('/payout', payload,config)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
    event.preventDefault()
  }
  handleAudit(event){
    this.setState({audit_date: event.target.value})
    const params = {
      audit_date: event.target.value,
      vendor_id: this.props.vendor.id
    }
    console.log(params)
    let self = this;
    axios.get('/audit', {params: params})
      .then(function (response) {
        self.setState({transactions: response.data})
      })
      .catch(function (error) {
        console.log(error)
      })
    event.preventDefault()
  }
  render () {
    const { classes } = this.props
    return (
      <Container component='main'>
        <CssBaseline />
        <Container style={{display: 'flex'}}>
          <Box mr={5}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Balance
            </Typography>
            <Typography component="p" variant="h4">
              ${parseFloat(this.state.balance).toFixed(2)}
            </Typography>

            <Typography color="textSecondary" className={classes.depositContext}>
              <strong>Last Payout: </strong>
            </Typography>
          </Box>
          <Box>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Payout Total
            </Typography>
            <Typography component="p" variant="h4">
              ${parseFloat(this.state.payout_balance).toFixed(2)}
            </Typography>

            <Typography color="textSecondary" className={classes.depositContext}>
              on 15 March, 2019
            </Typography>
          </Box>
        </Container>
        <Container>
          <Button
              onClick={(event) => this.handlePayout(event)}
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Payout
            </Button>
        </Container>
        <Box mt={2}>
          <Container>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Transactions
            </Typography>
            <Box mt={1} mb={1}>
              <TextField
                  id="date"
                  label="Audit"
                  type="date"
                  className={classes.textField}
                  onChange={(event) => this.handleAudit(event)}
                  value={this.state.audit_date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
            </Box>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Paid?</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell component="th" scope="row">
                        {transaction.id}
                      </TableCell>
                      <TableCell align="right">{transaction.is_bank ? 'Bank Transfer' : 'Credit Card'}</TableCell>
                      <TableCell align="right">${parseFloat(transaction.amount)}</TableCell>
                      <TableCell align="right">{transaction.payout_id ? 'Paid' : 'Unpaid'}</TableCell>
                      <TableCell align="right">{this.parseDate(transaction.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
          </TableContainer>
          </Container>
        </Box>
        <Box mt={2}>
          <Container>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Payouts
            </Typography>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                {this.state.payout_history.map((payout,index) =>
                  <React.Fragment key={index}>
                    <TableHead>
                    <TableRow style={{backgroundColor: '#3F51B5'}} >
                      <TableCell className={classes.head} >Payout ID: {payout.payout.id}</TableCell>
                      <TableCell className={classes.head} align="right">Total Paid: ${payout.payout.amount_paid}</TableCell>
                      <TableCell className={classes.head} align="right">Total Fees: ${payout.payout.fees}</TableCell>
                      <TableCell className={classes.head} align="right">{new Date(Date.parse(payout.payout.date)).toLocaleDateString('en-US')}</TableCell>
                      <TableCell className={classes.head} align="right"></TableCell>
                    </TableRow>
                    <TableRow><TableCell>Transactions:</TableCell></TableRow>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="right">Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Paid?</TableCell>
                      <TableCell align="right">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payout.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell component="th" scope="row">
                          {transaction.id}
                        </TableCell>
                        <TableCell align="right">{transaction.is_bank ? 'Bank Transfer' : 'Credit Card'}</TableCell>
                        <TableCell align="right">${parseFloat(transaction.amount)}</TableCell>
                        <TableCell align="right">{transaction.payout_id ? 'Paid' : 'Unpaid'}</TableCell>
                        <TableCell align="right">{this.parseDate(transaction.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </React.Fragment>
                )

                }

            </Table>
          </TableContainer>
          </Container>
        </Box>

        
      </Container>
    )
  }
}

Portal.propTypes = {
  classes: PropTypes.any
}

export default withStyles(styles, { withTheme: true })(Portal)