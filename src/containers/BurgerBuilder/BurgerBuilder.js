import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4, 
	meat: 1.3,
	bacon: 0.7
};


class BurgerBuilder extends Component{

	state ={
		ingredients:{
			salad: 0, 
			bacon: 0, 
			cheese: 0, 
			meat: 0
		},
		totalPrice: 4, 
		purchasble: false,
		purchasing: false, 
		loading: false, 
		error: false  
	}

	purchaseHandler = () => {
		this.setState({
			purchasing: true
		});
	};
    
    purchaseContinueHandler = () => {
    	this.setState({loading: true});
		// alert('You continued');
		const order = {
			ingredients: this.state.ingredients, 
			price: this.state.totalPrice, 
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
	};

	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false
		});
	};

	componentDidMount(){
		axios.get('/ingredients.json')
		 .then((response) => {
		 	console.log(response.data);
		 	this.setState({ingredients: response.data});
		 })
		 .catch((error)=>{
		 	console.log('error in ingredients');
		 	this.setState({error: false});
		 });
	}

	updatedPurchaseState (ingredients) {

		const sum = Object.keys(ingredients)
		    .map(igKey=>{
		    	return ingredients[igKey]
		    })
		    .reduce((sum, el) => {
		    	return sum + el;
		    }, 0);
		this.setState({
			purchasble: sum > 0
		});
	}

	addIngredienthandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;

		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({
			totalPrice: newPrice,
			ingredients: updatedIngredients
		});

		this.updatedPurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if(oldCount<=0){
			return;
		}
		const updatedCount = oldCount - 1;	
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = updatedCount;

		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({
			totalPrice: newPrice,
			ingredients: updatedIngredients
		});

		this.updatedPurchaseState(updatedIngredients);
	};

	render(){
		const disabledInfo = {
			...this.state.ingredients
		};

		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null,
		burger = this.state.error ? '<p> ingredients loading failed!' : <Spinner/>;
        if(this.state.ingredients){
        	burger = (
        	<Aux>
        		<Burger ingredients={this.state.ingredients}/>
				<BuildControls
				  ingredientAdded={this.addIngredienthandler}
				  ingredientRemoved={this.removeIngredientHandler}
				  disabled={disabledInfo}
				  purchasble={this.state.purchasble}
				  ordered={this.purchaseHandler}
				  price={this.state.totalPrice}
				  />
			</Aux>);
			orderSummary=<OrderSummary 
			       	ingredients={this.state.ingredients} 
			       	purchaseCanceled={this.purchaseCancelHandler}
			       	purchaseContinued={this.purchaseContinueHandler}
			       	totalPrice={this.state.totalPrice.toFixed(2)}
			       />;	
        }

		if(this.state.loading){
			orderSummary = <Spinner/>;
		}

		return (
			<Aux>
			    <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
			       {orderSummary}
			    </Modal>	
				{burger}
			</Aux>
			)
	}
}


export default withErrorHandler(BurgerBuilder, axios);