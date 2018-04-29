import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';


class BurgerBuilder extends Component{

	state ={
		purchasing: false
	}

	purchaseHandler = () => {
		this.setState({
			purchasing: true
		});
	};
    
    purchaseContinueHandler = () => {
    	this.props.onInitPurchase();
		this.props.history.push('/checkout');
	};

	purchaseCancelHandler = () => {
		this.setState({
			purchasing: false
		});
	};

	componentDidMount(){
		console.log('burger builder', this.props);
		this.props.onInitIngredients();
	}

	updatedPurchaseState (ingredients) {
		const sum = Object.keys(ingredients)
		    .map(igKey=>{
		    	return ingredients[igKey]
		    })
		    .reduce((sum, el) => {
		    	return sum + el;
		    }, 0);
		return sum > 0;
	}

	render(){
		const disabledInfo = {
			...this.props.ings
		};

		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null,
		burger = this.props.error ? '<p> ingredients loading failed!' : <Spinner/>;
        if(this.props.ings){
        	burger = (
        	<Aux>
        		<Burger ingredients={this.props.ings}/>
				<BuildControls
				  ingredientAdded={this.props.onIngredientAdded}
				  ingredientRemoved={this.props.onIngredientRemoved}
				  disabled={disabledInfo}
				  purchasble={this.updatedPurchaseState(this.props.ings)}
				  ordered={this.purchaseHandler}
				  price={this.props.price}
				  />
			</Aux>);
			orderSummary=<OrderSummary 
			       	ingredients={this.props.ings} 
			       	purchaseCanceled={this.purchaseCancelHandler}
			       	purchaseContinued={this.purchaseContinueHandler}
			       	totalPrice={this.props.price.toFixed(2)}
			       />;	
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

const mapStateToProps = (state) => {
  return {
  	ings: state.burgerBuilder.ingredients, 
  	price: state.burgerBuilder.totalPrice,
  	error: state.burgerBuilder.error
  };
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
		onInitPurchase: ()=> dispatch(burgerBuilderActions.purchaseInit())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));