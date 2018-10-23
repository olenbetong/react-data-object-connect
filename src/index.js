const events = [
	'AllowDeleteChanged',
	'AllowUpdateChanged',
	'AllowInsertChanged',
	'SaveFailed',
	'PartialDataLoaded',
	'DataLoadFailed',
	'FieldChanged',
	'RecordCreated',
	'RecordRefreshed',
	'RecordDeleting',
	'RecordDeleted',
	'AfterSave',
	'BeforeLoad',
	'BeforeSave',
	'CancelEdit',
	'CurrentIndexChanged',
	'DataLoaded',
	'DirtyChanged'
]

const dataObjectConnect = function(dataObject, currentRowOnly = false) {
  return function connect(WrappedComponent) {
	  const connector = class extends React.Component {
		  constructor(props) {
			  super(props);
			  
			  const initialState = {};
			  if (currentRowOnly) {
				  for (let field of dataObject.getFields()) {
					  initialState[field.name] = null;
				  }
			  } else {
				  initialState.data = [];
			  }

			  this.state = Object.assign({
					  canDelete: dataObject.isDeleteAllowed(),
					  canUpdate: dataObject.isUpdateAllowed(),
					  canInsert: dataObject.isInsertAllowed(),
					  currentIndex: dataObject.getCurrentIndex(),
					  isDirty: dataObject.isDirty(),
					  isDeleting: false,
					  isLoading: false,
					  isSaving: false,
					  loadError: null,
					  saveFailed: false
				  },
				  initialState
			  );
		  }
	  
		  componentDidMount() {
				for (let event of events) {
					dataObject.attachEvent('on' + event, this['handle' + event]);
				}
			  
			  this.updateData();
		  }
		  
		  componentWillUnmount() {
				for (let event of events) {
					dataObject.detachEvent('on' + event, this['handle' + event]);
				}
		  }
		  
		  cancelEdit() {
			  dataObject.cancelEdit();
		  }
		  
		  deleteRow(idx) {
			  return new Promise((resolve) => {
				  const callback = (error, data) => {
					  resolve({ data, error })
				  }

				  if (currentRowOnly) {
					  dataObject.deleteCurrentRow(callback);
				  } else {
					  dataObject.deleteRow(idx, callback);
				  }
			  });
		  }
		  
		  endEdit(callback) {
			  return new Promise((resolve) => {
				  dataObject.endEdit((error, data) => {
					  'function' === typeof callback && callback(error, data);
					  resolve({ data, error });
				  });
			  });
		  }
		  
		  updateData = (otherState = {}) => {
			  if (currentRowOnly) {
				  const record = dataObject.currentRow();
				  this.setState(Object.assign(record, otherState));
			  } else {
				  const data = dataObject.getData();
				  const current = dataObject.currentRow();
				  this.setState(Object.assign({ current, data }, otherState));
			  }
		  }
		  
		  handleAllowDeleteChanged = (allowed) => {
			  this.setState({ canDelete: allowed });
		  }
		  
		  handleAllowUpdateChanged = (allowed) => {
			  this.setState({ canUpdate: allowed });
		  }
		  
		  handleAllowInsertChanged = (allowed) => {
			  this.setState({ canInsert: allowed });
		  }
		  
		  handleSaveFailed = () => {
			  this.setState({ saveFailed: true });
		  }
		  
		  handlePartialDataLoaded = () => {
			  
		  }
		  
		  handleDataLoadFailed = (loadError) => {
			  if (loadError) {
				  this.setState({ isLoading: false , loadError });
			  } else {
				  this.setState({ isLoading: false });
			  }
		  }
		  
		  handleFieldChanged = () => {
			  this.updateData()
		  }
		  
		  handleRecordCreated = () => {
			  this.updateData();
		  }
		  
		  handleRecordRefreshed = () => {
			  this.updateData();
		  }
		  
		  handleRecordDeleting = () => {
			  this.setState({ isDeleting: true });
		  }
		  
		  handleRecordDeleted = () => {
			  this.updateData({ isDeleting: false });
		  }
		  
		  handleAfterSave = () => {
			  this.updateData({ isSaving: false });
		  }
		  
		  handleBeforeLoad = () => {
			  this.setState({ isLoading: true });
		  }
		  
		  handleBeforeSave = () => {
			  this.setState({ isSaving: true, saveFailed: false });
		  }
		  
		  handleCancelEdit = () => {
			  this.updateData({ isSaving: false });
		  }
		  
		  handleCurrentIndexChanged = (currentIndex) => {
			  if (currentRowOnly) {
				  this.updateData();
			  } else {
				  this.updateData();
				  this.setState({ currentIndex });
			  }
		  }
		  
		  handleDataLoaded = () => {
			  this.updateData({ isLoading: false, isSaving: false, isDeleting: false, saveFailed: false });
		  }
		  
		  handleDirtyChanged = () => {
			  this.setState({ isDirty: dataObject.isDirty() });
		  }
		  
		  refreshData(callback) {
			  return new Promise((resolve) => {
				  dataObject.refreshDataSource((error, data) => {
					  'function' === typeof callback && callback(error, data);
					  resolve({ data, error });
				  });
			  });
		  }
		  
		  refreshRow(callback) {
			  return new Promise((resolve) => {
				  dataObject.refreshCurrentRow((error, data) => {
					  'function' === typeof callback && callback(error, data);
					  resolve({ data, error });
				  });
			  });
		  }
		  
		  setFieldValue = (name, value) => {
			  dataObject.currentRow(name, value);
			  this.updateData();
		  }

		  setFieldValues = (fields) => {
			  for (let field in fields) {
				  if (fields.hasOwnProperty(field)) {
					  dataObject.currentRow(field, fields[field]);
				  }
			  }
			  this.updateData();
		  }
		  
		  setCurrentIndex(idx) {
			  dataObject.setCurrentIndex(idx);
		  }
		  
		  setParameter(...args) {
			  dataObject.setParameter(...args);
		  }
	  
		  render() {
			  return (
				  <WrappedComponent {...this.state}
					  onCancelEdit={this.cancelEdit}
					  onCurrentIndexChange={this.setCurrentIndex}
					  onDeleteRow={this.deleteRow}
					  onEndEdit={this.endEdit}
					  onFieldChange={this.setFieldValue}
					  onFieldsChange={this.setFieldValues}
					  onRefreshData={this.refreshData}
					  onRefreshRow={this.refreshRow}
					  onSetParameter={this.setParameter}
					  {...this.props}
					  />
			  )
		  }
	  }
	  
	  function getDisplayName() {
		  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	  }
	  
	  connector.displayName = `${dataObject.getDataSourceId()}(${getDisplayName()})`;
	  
	  return connector;
  }
};

dataObjectConnect.properties = [
  'onCancelEdit',
  'onCurrentIndexChange',
  'onEndEdit',
  'onDeleteRow',
  'onFieldChange',
  'onFieldsChange',
  'onRefreshData',
  'onRefreshRow',
  'onSetParameter',
  'canDelete',
  'canUpdate',
  'canInsert',
  'currentIndex',
  'isDirty',
  'isDeleting',
  'isLoading',
  'isSaving',
  'loadError',
  'saveFailed'
];

export default dataObjectConnect;
