import React from 'react';
import CollectionUtil from '../util/CollectionUtil.js';
import FlexModal from './FlexModal.jsx';
import SearchSnippet from './SearchSnippet.jsx';
import ItemDetails from './ItemDetails.jsx';

class FlexHits extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal : false,
			config: CollectionUtil.determineConfig(this.props.collection)
		};
	}

	gotoItemDetails(result) {
		console.debug(result);
		if(this.props.itemDetailsRecipe && result._id) {
			document.location.href = 'http://localhost:5302/recipe/' + this.props.itemDetailsRecipe + '?id=' + result._id;
			//this.setState({showModal: true})
		} else {
			this.setState({showModal: true})
		}
	}

	handleHideModal() {
		this.setState({showModal: false})
	}

	formatResult(result) {
		var formattedResult = JSON.parse(JSON.stringify(result._source));
		formattedResult._id = result._id;
		formattedResult._score = result._score;
		formattedResult._type = result._type;
		formattedResult._index = result._index;
		return formattedResult;
	}

	render() {
		let formattedResult = this.formatResult(this.props.result);
		const result = this.state.config.getItemDetailData(formattedResult);
		const snippet = this.state.config.getResultSnippetData(result);
		return (
			<div
				className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}
				key={result._id}
				onClick={this.gotoItemDetails.bind(this, result)}
			>
				<SearchSnippet data={snippet}/>

				{this.state.showModal ?
					<FlexModal
						elementId={result._id + '__modal'}
						key={result._id + '__modal'}
						handleHideModal={this.handleHideModal.bind(this)}
						title={result.title}>
						<ItemDetails data={result}/>
					</FlexModal>: null
				}

			</div>
		);
	}
}

export default FlexHits;