const dataObjectConnect = function(dataObject, currentRowOnly = false) {
  return function connect(WrappedComponent) {
	  const connector = class extends React.Component {
		  constructor(props) {
			  super(props);
			  
			  this.handleAllowDeleteChanged = this.handleAllowDeleteChanged.bind(this);
			  this.handleAllowUpdateChanged = this.handleAllowUpdateChanged.bind(this);
			  this.handleAllowInsertChanged = this.handleAllowInsertChanged.bind(this);
			  this.handleSaveFailed = this.handleSaveFailed.bind(this);
			  this.handlePartialDataLoaded = this.handlePartialDataLoaded.bind(this);
			  this.handleDataLoadFailed = this.handleDataLoadFailed.bind(this);
			  this.handleFieldChanged = this.handleFieldChanged.bind(this);
			  this.handleRecordCreated = this.handleRecordCreated.bind(this);
			  this.handleRecordRefreshed = this.handleRecordRefreshed.bind(this);
			  this.handleRecordDeleting = this.handleRecordDeleting.bind(this);
			  this.handleRecordDeleted = this.handleRecordDeleted.bind(this);
			  this.handleAfterSave = this.handleAfterSave.bind(this);
			  this.handleBeforeSave = this.handleBeforeSave.bind(this);
			  this.handleBeforeLoad = this.handleBeforeLoad.bind(this);
			  this.handleCancelEdit = this.handleCancelEdit.bind(this);
			  this.handleCurrentIndexChanged = this.handleCurrentIndexChanged.bind(this);
			  this.handleDataLoaded = this.handleDataLoaded.bind(this);
			  this.handleDirtyChanged = this.handleDirtyChanged.bind(this);
			  this.setFieldValue = this.setFieldValue.bind(this);
			  this.setFieldValues = this.setFieldValues.bind(this);
			  
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
			  dataObject.attachEvent('onAllowDeleteChanged', this.handleAllowDeleteChanged);
			  dataObject.attachEvent('onAllowUpdateChanged', this.handleAllowUpdateChanged);
			  dataObject.attachEvent('onAllowInsertChanged', this.handleAllowInsertChanged);
			  dataObject.attachEvent('onSaveFailed', this.handleSaveFailed);
			  dataObject.attachEvent('onPartialDataLoaded', this.handlePartialDataLoaded);
			  dataObject.attachEvent('onDataLoadFailed', this.handleDataLoadFailed);
			  dataObject.attachEvent('onFieldChanged', this.handleFieldChanged);
			  dataObject.attachEvent('onRecordCreated', this.handleRecordCreated);
			  dataObject.attachEvent('onRecordRefreshed', this.handleRecordRefreshed);
			  dataObject.attachEvent('onRecordDeleting', this.handleRecordDeleting);
			  dataObject.attachEvent('onRecordDeleted', this.handleRecordDeleted);
			  dataObject.attachEvent('onAfterSave', this.handleAfterSave);
			  dataObject.attachEvent('onBeforeLoad', this.handleBeforeLoad);
			  dataObject.attachEvent('onBeforeSave', this.handleBeforeSave);
			  dataObject.attachEvent('onCancelEdit', this.handleCancelEdit);
			  dataObject.attachEvent('onCurrentIndexChanged', this.handleCurrentIndexChanged);
			  dataObject.attachEvent('onDataLoaded', this.handleDataLoaded);
			  dataObject.attachEvent('onDirtyChanged', this.handleDirtyChanged);
			  
			  this.updateData();
		  }
		  
		  componentWillUnmount() {
			  dataObject.detachEvent('onAllowDeleteChanged', this.handleAllowDeleteChanged);
			  dataObject.detachEvent('onAllowUpdateChanged', this.handleAllowUpdateChanged);
			  dataObject.detachEvent('onAllowInsertChanged', this.handleAllowInsertChanged);
			  dataObject.detachEvent('onSaveFailed', this.handleSaveFailed);
			  dataObject.detachEvent('onPartialDataLoaded', this.handlePartialDataLoaded);
			  dataObject.detachEvent('onDataLoadFailed', this.handleDataLoadFailed);
			  dataObject.detachEvent('onFieldChanged', this.handleFieldChanged);
			  dataObject.detachEvent('onRecordCreated', this.handleRecordCreated);
			  dataObject.detachEvent('onRecordRefreshed', this.handleRecordRefreshed);
			  dataObject.detachEvent('onRecordDeleting', this.handleRecordDeleting);
			  dataObject.detachEvent('onRecordDeleted', this.handleRecordDeleted);
			  dataObject.detachEvent('onAfterSave', this.handleAfterSave);
			  dataObject.detachEvent('onBeforeLoad', this.handleBeforeLoad);
			  dataObject.detachEvent('onBeforeSave', this.handleBeforeSave);
			  dataObject.detachEvent('onCancelEdit', this.handleCancelEdit);
			  dataObject.detachEvent('onCurrentIndexChanged', this.handleCurrentIndexChanged);
			  dataObject.detachEvent('onDataLoaded', this.handleDataLoaded);
			  dataObject.detachEvent('onDirtyChanged', this.handleDirtyChanged);
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
		  
		  updateData(otherState = {}) {
			  if (currentRowOnly) {
				  const record = dataObject.currentRow();
				  this.setState(Object.assign(record, otherState));
			  } else {
				  const data = dataObject.getData();
				  const current = dataObject.currentRow();
				  this.setState(Object.assign({ current, data }, otherState));
			  }
		  }
		  
		  handleAllowDeleteChanged(allowed) {
			  this.setState({ canDelete: allowed });
		  }
		  
		  handleAllowUpdateChanged(allowed) {
			  this.setState({ canUpdate: allowed });
		  }
		  
		  handleAllowInsertChanged(allowed) {
			  this.setState({ canInsert: allowed });
		  }
		  
		  handleSaveFailed() {
			  this.setState({ saveFailed: true });
		  }
		  
		  handlePartialDataLoaded() {
			  
		  }
		  
		  handleDataLoadFailed(loadError) {
			  if (loadError) {
				  this.setState({ isLoading: false , loadError });
			  } else {
				  this.setState({ isLoading: false });
			  }
		  }
		  
		  handleFieldChanged({ name, value }) {
			  this.updateData()
		  }
		  
		  handleRecordCreated() {
			  this.updateData();
		  }
		  
		  handleRecordRefreshed() {
			  this.updateData();
		  }
		  
		  handleRecordDeleting() {
			  this.setState({ isDeleting: true });
		  }
		  
		  handleRecordDeleted() {
			  this.updateData({ isDeleting: false });
		  }
		  
		  handleAfterSave() {
			  this.updateData({ isSaving: false });
		  }
		  
		  handleBeforeLoad() {
			  this.setState({ isLoading: true });
		  }
		  
		  handleBeforeSave() {
			  this.setState({ isSaving: true, saveFailed: false });
		  }
		  
		  handleCancelEdit() {
			  this.updateData({ isSaving: false });
		  }
		  
		  handleCurrentIndexChanged(currentIndex) {
			  if (currentRowOnly) {
				  this.updateData();
			  } else {
				  this.updateData();
				  this.setState({ currentIndex });
			  }
		  }
		  
		  handleDataLoaded() {
			  this.updateData({ isLoading: false, isSaving: false, isDeleting: false, saveFailed: false });
		  }
		  
		  handleDirtyChanged() {
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
		  
		  setFieldValue(name, value) {
			  dataObject.currentRow(name, value);
			  this.updateData();
		  }

		  setFieldValues(fields) {
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
