import React, { Component } from 'react';
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
				value: ''
			}, 
			street:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Street'
				}, 
				value: ''
			}, 
			zipcode:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Zip Code'
				}, 
				value: ''
			},
			country:  {
				elementType: 'input', 
				elementConfig: {
					type: 'text', 
					placeholder: 'Country'
				}, 
				value: ''
			},
			email:  {
				elementType: 'input', 
				elementConfig: {
					type: 'email', 
					placeholder: 'Your E-mail'
				}, 
				value: ''
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
				value: ''
			}
		},
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
			ingredients: this.state.ingredients, 
			price: this.state.price, 
			orderData: formData
		};
		axios.post('/orders.json', order)
		.then((response) => {
				this.setState({loading: false}); 
				this.props.history.push( '/' );
		})
		.catch((error) => {this.setState({loading: false}); console.log('error in order', error);});
	};

    inputChangedhandler = (event, inputIdentifier) => {
    	const updatedOrderForm = {
    		...this.state.orderForm
    	};
    	const updatedFormElement = {
    		...updatedOrderForm[inputIdentifier]
    	};
    	updatedFormElement.value = event.target.value;
    	updatedOrderForm[inputIdentifier] = updatedFormElement;
    	this.setState({orderForm: updatedOrderForm });
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
							changed={(event)=>this.inputChangedhandler(event, formElement.id )}/>
						))}
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