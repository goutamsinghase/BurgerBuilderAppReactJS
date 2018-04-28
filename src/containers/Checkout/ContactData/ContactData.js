import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
class ContactData extends Component{
	state = {
		orderForm:{
			name: {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Your Name'
				}, 
				value: '', 
				validation: {
					required: true
				}, 
				valid: false, 
				touched: false
			}, 
			street:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Street'
				}, 
				value: '', 
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			}, 
			zipcode:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Zip Code'
				}, 
				value: '', 
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				}, 
				valid: false,
				touched: false
			},
			country:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Country'
				}, 
				value: '', 
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			},
			email:  {
				elementType: 'input', 
				elementConfig: {
					type: 'email', 
					placeholder: 'Your E-mail'
				}, 
				value: '', 
				validation: {
					required: true
				}, 
				valid: false,
				touched: false
			}, 
			deliveryMethod:  {
				elementType: 'select', 
				elementConfig: {
					options: [{
						value: 'fastest', 
						displayvalue: 'Fastest'
					},
					{
						value: 'cheapest', 
						displayvalue: 'Cheapest'
					}]
				}, 
				value: 'fastest',
				valid: true,
				validation: {}
			}
		},
		formIsValid: false,
		loading: false
	};

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({loading: true});
		const formData = {};
		for(let formElementIdentifier in this.state.orderForm){
			formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier];
		}
		const order = {
			ingredients: this.props.ings, 
			price: this.props.price, 
			orderData: formData
		};
		axios.post('/orders.json', order)
		.then((response) => {
				this.setState({loading: false}); 
				this.props.history.push( '/' );
		})
		.catch((error) => {this.setState({loading: false}); console.log('error in order', error);});
	};

	checkValidity(value, rules) {
		let isValid = true;
		if(!rules){
			return true;
		}
		if(rules.required){
			isValid = value.trim() !== '' && isValid;
		}

		if(rules.minLength){
			isValid = value.length >= rules.minLength && isValid;

		}
		
		if(rules.maxLength){
			isValid = value.length <= rules.maxLength && isValid;
		}
		return isValid;
	}

    inputChangedhandler = (event, inputIdentifier) => {
    	const updatedOrderForm = {
    		...this.state.orderForm
    	};
    	const updatedFormElement = {
    		...updatedOrderForm[inputIdentifier]
    	};
    	updatedFormElement.value = event.target.value;
    	updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    	updatedFormElement.touched = true;
    	updatedOrderForm[inputIdentifier] = updatedFormElement;
    	let formIsValid = true;
    	for(let inputIdentifier in updatedOrderForm){
    		formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    	}
    	this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid });
    }


	render(){
		const formElementsArray = [];
		for(let key in this.state.orderForm){
			formElementsArray.push({
				id: key, 
				config: this.state.orderForm[key]
			});
		}
		let form = (<form className={classes.Form}>
					{formElementsArray.map(formElement =>(
						<Input 
						    key={formElement.id}
							elementType={formElement.config.elementType} 
							elementConfig={formElement.config.elementConfig}
							value={formElement.config.value}
							invalid={!formElement.config.valid}
							shouldValidate={formElement.config.validation}
							touched={formElement.config.touched}
							changed={(event)=>this.inputChangedhandler(event, formElement.id )}/>
						))}
					<Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}> ORDER </Button>
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
const mapStateToProps = (state) => {
 	return {
 		ings: state.ingredients, 
 		price: state.totalPrice
 	};
};

export default connect(mapStateToProps)(ContactData);