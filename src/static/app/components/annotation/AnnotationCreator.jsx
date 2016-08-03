import CommentingForm from './CommentingForm';
import ClassifyingForm from './ClassifyingForm';
import LinkingForm from './LinkingForm';

class AnnotationCreator extends React.Component {

	constructor(props) {
		super(props);
		//make this less shitty verbosey
		let comments = [];
		let classifications = [];
		let links = [];
		if(this.props.annotation) {
			if(this.props.annotation.data.classifications) {
				classifications = this.props.annotation.data.classifications;
			}
			if(this.props.annotation.data.comments) {
				comments = this.props.annotation.data.comments;
			}
			if(this.props.annotation.data.links) {
				links = this.props.annotation.data.links;
			}
		}
		let activeTab = null;
		for(let i=0;i<Object.keys(this.props.annotationModes).length;i++) {
			if(Object.keys(this.props.annotationModes)[i] != 'bookmark') {
				activeTab = Object.keys(this.props.annotationModes)[i];
				break;
			}
		}
		this.state = {
			modes : this.props.annotationModes,
			activeTab : activeTab,
			classifications : classifications,
			comments : comments,
			links : links
		}
	}

	updateAnnotationData(mode, value) {
		this.setState({[mode] : value});
	}

	//TODO this function looks like it could be more optimized
	gatherDataAndSave() {
		var annotation = this.props.annotation;
		if(!annotation) {
			annotation = {
				user : this.props.user
			};
			if(this.props.playerAPI) {
				let activeSegment = this.props.playerAPI.getActiveSegment();
				if(activeSegment) {
					annotation.start = activeSegment.start;
					annotation.end = activeSegment.end;
				}
			}
		}
		var data = {};
		if(this.state.classifications.length > 0) {
			data['classifications'] = this.state.classifications;
		}
		if(this.state.comments.length > 0) {
			data['comments'] = this.state.comments
		}
		if(this.state.links.length > 0) {
			data['links'] = this.state.links
		}
		annotation.data = data;
		this.props.saveAnnotation(annotation);
	}

	render() {
		//generate the tabs from the configured modes
		const tabs = Object.keys(this.state.modes).map(function(mode) {
			if(mode == 'bookmark') return null;
			return (
				<li
					key={mode + '__tab_option'}
					className={this.state.activeTab == mode ? 'active' : ''}
				>
					<a data-toggle="tab" href={'#' + mode}>
						{mode}
					</a>
				</li>
				)
		}, this)

		//generate the content of each tab (a form based on a annotation mode/motivation)
		var tabContents = Object.keys(this.state.modes).map(function(mode) {
			if(mode == 'bookmark') return null;
			let form = '';
			switch(mode) {
				case 'comment' : form = (
					<CommentingForm
						data={this.state.comments}
						config={this.state.modes[mode]}
						updateAnnotationData={this.updateAnnotationData.bind(this)}
					/>
				);break;
				case 'classify' : form = (
					<ClassifyingForm
						data={this.state.classifications}
						config={this.state.modes[mode]}
						updateAnnotationData={this.updateAnnotationData.bind(this)}
					/>
				);break;
				case 'link' : form = (
					<LinkingForm
						data={this.state.links}
						config={this.state.modes[mode]}
						updateAnnotationData={this.updateAnnotationData.bind(this)}
					/>
				);break;
			}
			return (
				<div
					key={mode + '__tab_content'}
					id={mode}
					className={this.state.activeTab == mode ? 'tab-pane active' : 'tab-pane'}>
						{form}
				</div>
				);
		}, this);

		return (
			<div>
				<ul className="nav nav-tabs">
					{tabs}
				</ul>
				<div className="tab-content">
					{tabContents}
				</div>
				<div className="text-right">
					<button
						type="button"
						className="btn btn-primary"
						onClick={this.gatherDataAndSave.bind(this)}>
						Save
					</button>
				</div>
			</div>
		)
	}
}

export default AnnotationCreator;