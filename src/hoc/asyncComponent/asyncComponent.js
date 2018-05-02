import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
	return class extends Component{
		state = {
			component: null
		}

		componentDidMount(){
			importComponent()
				.then(cmp => {
					this.setState({
						compoent: cmp.default
					});
				});
		}

		render(){
			const C = this.state.compoent;
			return C?<C {...this.props}/> : null;
		}
	}
}

export default asyncComponent;