import React from "react";

const events = [
  "AllowDeleteChanged",
  "AllowUpdateChanged",
  "AllowInsertChanged",
  "SaveFailed",
  "PartialDataLoaded",
  "DataLoadFailed",
  "FieldChanged",
  "RecordCreated",
  "RecordRefreshed",
  "RecordDeleting",
  "RecordDeleted",
  "AfterSave",
  "BeforeLoad",
  "BeforeSave",
  "CancelEdit",
  "CurrentIndexChanged",
  "DataLoaded",
  "DirtyChanged",
];

export function connect(dataObject, currentRowOnly = false) {
  return function connect(WrappedComponent) {
    function getDataObject() {
      return typeof dataObject === "string" ? window[dataObject] : dataObject;
    }

    const connector = class extends React.Component {
      constructor(props) {
        super(props);

        const initialState = {};
        const dataObject = getDataObject();

        if (currentRowOnly) {
          for (let field of dataObject.getFields()) {
            initialState[field.name] = null;
          }
        } else {
          initialState.data = [];
        }

        this.state = Object.assign(
          {
            canDelete: dataObject.isDeleteAllowed(),
            canUpdate: dataObject.isUpdateAllowed(),
            canInsert: dataObject.isInsertAllowed(),
            currentIndex: dataObject.getCurrentIndex(),
            isDirty: dataObject.isDirty(),
            isDeleting: false,
            isLoading: dataObject.isDataLoading() === true,
            isSaving: false,
            loadError: null,
            saveFailed: false,
          },
          initialState,
        );

        this.handleAfterSave = this.handleAfterSave.bind(this);
        this.handleAllowDeleteChanged = this.handleAllowDeleteChanged.bind(this);
        this.handleAllowInsertChanged = this.handleAllowInsertChanged.bind(this);
        this.handleAllowUpdateChanged = this.handleAllowUpdateChanged.bind(this);
        this.handleBeforeLoad = this.handleBeforeLoad.bind(this);
        this.handleBeforeSave = this.handleBeforeSave.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);
        this.handleCurrentIndexChanged = this.handleCurrentIndexChanged.bind(this);
        this.handleDataLoaded = this.handleDataLoaded.bind(this);
        this.handleDataLoadFailed = this.handleDataLoadFailed.bind(this);
        this.handleDirtyChanged = this.handleDirtyChanged.bind(this);
        this.handlePartialDataLoaded = this.handlePartialDataLoaded.bind(this);
        this.handleRecordDeleting = this.handleRecordDeleting.bind(this);
        this.handleRecordDeleted = this.handleRecordDeleted.bind(this);
        this.handleSaveFailed = this.handleSaveFailed.bind(this);
        this.setFieldValue = this.setFieldValue.bind(this);
        this.setFieldValues = this.setFieldValues.bind(this);
        this.updateData = this.updateData.bind(this);

        this.handleFieldChanged = this.updateData;
        this.handleRecordCreated = this.updateData;
        this.handleRecordRefreshed = this.updateData;
      }

      componentDidMount() {
        const dataObject = getDataObject();

        for (let event of events) {
          dataObject.attachEvent("on" + event, this["handle" + event]);
        }

        this.updateData();
      }

      componentWillUnmount() {
        const dataObject = getDataObject();

        for (let event of events) {
          dataObject.detachEvent("on" + event, this["handle" + event]);
        }
      }

      cancelEdit() {
        getDataObject().cancelEdit();
      }

      deleteRow(idx) {
        const dataObject = getDataObject();

        return new Promise((resolve) => {
          const callback = (error, data) => {
            resolve({ data, error });
          };

          if (currentRowOnly) {
            dataObject.deleteCurrentRow(callback);
          } else {
            dataObject.deleteRow(idx, callback);
          }
        });
      }

      endEdit(callback) {
        const dataObject = getDataObject();

        return new Promise((resolve) => {
          dataObject.endEdit((error, data) => {
            "function" === typeof callback && callback(error, data);
            resolve({ data, error });
          });
        });
      }

      updateData(otherState = {}) {
        const dataObject = getDataObject();

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
        return null;
      }

      handleDataLoadFailed(loadError) {
        if (loadError) {
          this.setState({ isLoading: false, loadError });
        } else {
          this.setState({ isLoading: false });
        }
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
        this.updateData({
          isLoading: false,
          isSaving: false,
          isDeleting: false,
          saveFailed: false,
        });
      }

      handleDirtyChanged() {
        this.setState({ isDirty: getDataObject().isDirty() });
      }

      refreshData(callback) {
        const dataObject = getDataObject();

        return new Promise((resolve) => {
          dataObject.refreshDataSource((error, data) => {
            "function" === typeof callback && callback(error, data);
            resolve({ data, error });
          });
        });
      }

      refreshRow(callback) {
        const dataObject = getDataObject();

        return new Promise((resolve) => {
          dataObject.refreshCurrentRow((error, data) => {
            "function" === typeof callback && callback(error, data);
            resolve({ data, error });
          });
        });
      }

      setFieldValue(name, value) {
        getDataObject().currentRow(name, value);
        this.updateData();
      }

      setFieldValues(fields) {
        const dataObject = getDataObject();

        for (let field in fields) {
          if (Object.prototype.hasOwnProperty.call(fields, field)) {
            dataObject.currentRow(field, fields[field]);
          }
        }
        this.updateData();
      }

      setCurrentIndex(idx) {
        getDataObject().setCurrentIndex(idx);
      }

      setParameter(...args) {
        getDataObject().setParameter(...args);
      }

      render() {
        return React.createElement(WrappedComponent, {
          ...this.state,
          onCancelEdit: this.cancelEdit,
          onCurrentIndexChange: this.setCurrentIndex,
          onDeleteRow: this.deleteRow,
          onEndEdit: this.endEdit,
          onFieldChange: this.setFieldValue,
          onFieldsChange: this.setFieldValues,
          onRefreshData: this.refreshData,
          onRefreshRow: this.refreshRow,
          onSetParameter: this.setParameter,
          ...this.props,
        });
      }
    };

    function getDisplayName() {
      return WrappedComponent.displayName || WrappedComponent.name || "Component";
    }

    connector.displayName = typeof dataObject === "string" ? dataObject : dataObject.getDataSourceId();
    connector.displayName += `(${getDisplayName()})`;

    return connector;
  };
}

export const properties = [
  "onCancelEdit",
  "onCurrentIndexChange",
  "onEndEdit",
  "onDeleteRow",
  "onFieldChange",
  "onFieldsChange",
  "onRefreshData",
  "onRefreshRow",
  "onSetParameter",
  "canDelete",
  "canUpdate",
  "canInsert",
  "currentIndex",
  "isDirty",
  "isDeleting",
  "isLoading",
  "isSaving",
  "loadError",
  "saveFailed",
];

export const connectRow = (dataObject) => connect(dataObject, true);
