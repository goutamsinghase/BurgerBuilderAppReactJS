import React, { Component} from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';



class OrderSummary extends Component{
  // This could be a functional component, doesn't have to be a class component
  componentWillUpdate(){
    console.log('[OrderSummary] willUpdate');
  }

  render(){
    const ingredientSummary = Object.keys(this.props.ingredients)
       .map(igKey=>{
        return (<li key={igKey}> <span style={{textTransform: 'capitalize'}} >{igKey}</span>: {this.props.ingredients[igKey]}</li>);
       });

    return (
      <Aux>
        <h3> Your Order </h3>
              <p> XYZ </p>
              <ul>
                {ingredientSummary}
              </ul>
              <p><strong> Total Price</strong> {this.props.totalPrice}</p> 
              <p> Continue to Checkout? </p>
              <Button btnType="Danger" clicked={this.props.purchaseCanceled}> CANCEL </Button>
              <Button btnType="Success" clicked={this.props.purchaseContinued}> CONTINUE </Button>
      </Aux>
    );
  }

}

export default OrderSummary;