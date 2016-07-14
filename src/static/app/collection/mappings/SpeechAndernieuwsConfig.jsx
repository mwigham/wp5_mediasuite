import React from 'react';
import TimeUtil from '../../util/TimeUtil.js';
import CollectionUtil from '../../util/CollectionUtil.js';
import FlexModal from '../../components/FlexModal.jsx';
import {CollectionConfig} from './CollectionConfig.jsx';
import SearchResult from '../../components/SearchResult.jsx';
import ItemDetails from '../../components/ItemDetails.jsx';

export class SpeechAndernieuwsConfig extends CollectionConfig {
	constructor() {
		super();
	}

	getDocumentType() {
		return 'asr_chunk';
	}

	getSearchableFields() {
		return ["words"];
	}

	getDateFields() {
		return ['metadata.broadcast_date'];
	}

	getFacets() {
		var ranges = TimeUtil.generateYearAggregationSK(1910, 2010);
		return [
			{
				field: 'keywords.word',
				title : 'Keyword',
				id : 'keyword',
				operator : 'AND',
				size : 10
			}
		];
	}

	getSearchHitClass() {
		return SpeechAndernieuwsHit;
	}

	getItemDetailData(result) {
		//http://os-immix-w/an-mp3
		return result;
	}

	getResultSnippetData(result) {
		return {
			id: result.asr_file,
			speech: result.words
		}

	}
}


// Search hit element definition
export class SpeechAndernieuwsHit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal : false,
			config: CollectionUtil.determineConfig('spraak__andernieuws')
		};
	}

	handleShowModal() {
		this.setState({showModal: true})
	}

	handleHideModal() {
		this.setState({showModal: false})
	}

	render() {
		let result = this.state.config.getItemDetailData(this.props.result);
		let snippet = this.state.config.getResultSnippetData(result);
		return (
			<div
				className={this.props.bemBlocks.item().mix(this.props.bemBlocks.container("item"))}
				key={result.id}
				onClick={this.handleShowModal.bind(this)}
			>
				<SearchResult data={snippet}/>

				{this.state.showModal ?
					<FlexModal
						key={result.id + '__modal'}
						handleHideModal={this.handleHideModal.bind(this)}
						title={result.id}>
						<ItemDetails data={result}/>
					</FlexModal>: null
				}

			</div>
		);
	}
}