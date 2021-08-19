import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import axios from 'axios'

const styles = theme => ({
    table: {
        minWidth: 650,
      },
})

class TransactionConfirmed extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
        vendor_email: '',
        vendor_name: ''
    }
  }
  componentDidMount(){
      this.setState({vendor_email: this.props.vendor.email, vendor_name: this.props.vendor.name})
  }

  renderInfo(field, value){
      return <p><strong>{field}</strong> {value}</p>
  }
  render () {
    const { classes } = this.props
    return (
      <Container component='main' align='center'>
        <CssBaseline />
        <Box m={5}>
            <Typography component='h1' variant='h3'>
                Transaction confirmed
            </Typography>
            <Typography component='h5' variant='p'>
                Payment sent to {this.state.vendor_name}
            </Typography>
        </Box>
        
        <TableContainer component={Paper}>
        <Table aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Field</TableCell>
                <TableCell align="right">Value</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {Object.keys(this.props.transaction).map((key) => {
                if(this.props.transaction[key] != null){
                    let value = this.props.transaction[key];
                    let field = key;
                    if(key == 'is_bank'){
                        field = 'Payment Type'
                        value = (value) ? 'Bank Transfer' : 'Credit Card';
                    }
                    if(key == 'vendor_id'){
                        field = 'Vendor Email'
                        value = this.state.vendor_email
                    }
                return (
                        <TableRow key={key}>
                        <TableCell component="th" scope="row">
                            <strong>{field}</strong>
                        </TableCell>
                        <TableCell align="right">{value}</TableCell>
                        </TableRow>)}
            })}
            </TableBody>
        </Table>
        </TableContainer>
      </Container>
    )
  }
}

TransactionConfirmed.propTypes = {
  classes: PropTypes.any
}

export default withStyles(styles, { withTheme: true })(TransactionConfirmed)