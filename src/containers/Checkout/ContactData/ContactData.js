import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
class ContactData extends Component{
	state = {
		name: '', 
		email: '',
		address: {
			street: '', 
			postalCode: ''
		},
		loading: false
	};

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({loading: true});
		alert('You continued');
		const order = {
			ingredients: this.state.ingredients, 
			price: this.state.price, 
			customer: {
				name: 'Goutam Singha', 
				address: {
					street: 'Test Street', 
					zipcode: '43215',
					country: 'Germany'
				}, 
				email: 'goutam.singha@innofied.com'
			}, 
			deliveryMethod: 'fastest'
		};


		axios.post('/orders.json', order)
		.then((response) => {this.setState({loading: false}); console.log(response);})
		.catch((error) => {this.setState({loading: false}); console.log('error in order', error);});
		
		console.log(this.props.ingredients);
	};

	render(){
		let form = (<form className={classes.Form}>
					<input className={classes.Input} type="text" name="name" placeholder="Your name"/>
					<input className={classes.Input} type="email" name="email" placeholder="Your email"/>
					<input className={classes.Input} type="text" name="street" placeholder="Steet Address"/>
					<input className={classes.Input} type="text" name="postal" placeholder="Postal Code"/>
					<Button btnType="Success" clicked={this.orderHandler}> ORDER </Button>
				</form>);
		if(this.state.loading){
			form = <Spinner/>;
		}

		return (
			<div className={classes.ContactData}>
				<h4>  Enter your Contact Data </h4>
				{form}
			</div>
		);
	}
}

export default ContactData;