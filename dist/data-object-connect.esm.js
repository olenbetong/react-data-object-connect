function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

const events = ['AllowDeleteChanged', 'AllowUpdateChanged', 'AllowInsertChanged', 'SaveFailed', 'PartialDataLoaded', 'DataLoadFailed', 'FieldChanged', 'RecordCreated', 'RecordRefreshed', 'RecordDeleting', 'RecordDeleted', 'AfterSave', 'BeforeLoad', 'BeforeSave', 'CancelEdit', 'CurrentIndexChanged', 'DataLoaded', 'DirtyChanged'];

const dataObjectConnect = function dataObjectConnect(dataObject, currentRowOnly = false) {
  return function connect(WrappedComponent) {
    const connector = class connector extends React.Component {
      constructor(props) {
        super(props);

        _defineProperty(this, "updateData", (otherState = {}) => {
          if (currentRowOnly) {
            const record = dataObject.currentRow();
            this.setState(Object.assign(record, otherState));
          } else {
            const data = dataObject.getData();
            const current = dataObject.currentRow();
            this.setState(Object.assign({
              current,
              data
            }, otherState));
          }
        });

        _defineProperty(this, "handleAllowDeleteChanged", allowed => this.setState({
          canDelete: allowed
        }));

        _defineProperty(this, "handleAllowUpdateChanged", allowed => this.setState({
          canUpdate: allowed
        }));

        _defineProperty(this, "handleAllowInsertChanged", allowed => this.setState({
          canInsert: allowed
        }));

        _defineProperty(this, "handleSaveFailed", () => this.setState({
          saveFailed: true
        }));

        _defineProperty(this, "handlePartialDataLoaded", () => null);

        _defineProperty(this, "handleDataLoadFailed", loadError => {
          if (loadError) {
            this.setState({
              isLoading: false,
              loadError
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });

        _defineProperty(this, "handleFieldChanged", this.updateData);

        _defineProperty(this, "handleRecordCreated", this.updateData);

        _defineProperty(this, "handleRecordRefreshed", this.updateData);

        _defineProperty(this, "handleRecordDeleting", () => this.setState({
          isDeleting: true
        }));

        _defineProperty(this, "handleRecordDeleted", () => this.updateData({
          isDeleting: false
        }));

        _defineProperty(this, "handleAfterSave", () => this.updateData({
          isSaving: false
        }));

        _defineProperty(this, "handleBeforeLoad", () => this.setState({
          isLoading: true
        }));

        _defineProperty(this, "handleBeforeSave", () => this.setState({
          isSaving: true,
          saveFailed: false
        }));

        _defineProperty(this, "handleCancelEdit", () => this.updateData({
          isSaving: false
        }));

        _defineProperty(this, "handleCurrentIndexChanged", currentIndex => {
          if (currentRowOnly) {
            this.updateData();
          } else {
            this.updateData();
            this.setState({
              currentIndex
            });
          }
        });

        _defineProperty(this, "handleDataLoaded", () => this.updateData({
          isLoading: false,
          isSaving: false,
          isDeleting: false,
          saveFailed: false
        }));

        _defineProperty(this, "handleDirtyChanged", () => this.setState({
          isDirty: dataObject.isDirty()
        }));

        _defineProperty(this, "setFieldValue", (name, value) => {
          dataObject.currentRow(name, value);
          this.updateData();
        });

        _defineProperty(this, "setFieldValues", fields => {
          for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
              dataObject.currentRow(field, fields[field]);
            }
          }

          this.updateData();
        });

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
        }, initialState);
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
        return new Promise(resolve => {
          const callback = (error, data) => {
            resolve({
              data,
              error
            });
          };

          if (currentRowOnly) {
            dataObject.deleteCurrentRow(callback);
          } else {
            dataObject.deleteRow(idx, callback);
          }
        });
      }

      endEdit(callback) {
        return new Promise(resolve => {
          dataObject.endEdit((error, data) => {
            'function' === typeof callback && callback(error, data);
            resolve({
              data,
              error
            });
          });
        });
      }

      refreshData(callback) {
        return new Promise(resolve => {
          dataObject.refreshDataSource((error, data) => {
            'function' === typeof callback && callback(error, data);
            resolve({
              data,
              error
            });
          });
        });
      }

      refreshRow(callback) {
        return new Promise(resolve => {
          dataObject.refreshCurrentRow((error, data) => {
            'function' === typeof callback && callback(error, data);
            resolve({
              data,
              error
            });
          });
        });
      }

      setCurrentIndex(idx) {
        dataObject.setCurrentIndex(idx);
      }

      setParameter(...args) {
        dataObject.setParameter(...args);
      }

      render() {
        return React.createElement(WrappedComponent, _extends({}, this.state, {
          onCancelEdit: this.cancelEdit,
          onCurrentIndexChange: this.setCurrentIndex,
          onDeleteRow: this.deleteRow,
          onEndEdit: this.endEdit,
          onFieldChange: this.setFieldValue,
          onFieldsChange: this.setFieldValues,
          onRefreshData: this.refreshData,
          onRefreshRow: this.refreshRow,
          onSetParameter: this.setParameter
        }, this.props));
      }

    };

    function getDisplayName() {
      return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    connector.displayName = `${dataObject.getDataSourceId()}(${getDisplayName()})`;
    return connector;
  };
};

dataObjectConnect.properties = ['onCancelEdit', 'onCurrentIndexChange', 'onEndEdit', 'onDeleteRow', 'onFieldChange', 'onFieldsChange', 'onRefreshData', 'onRefreshRow', 'onSetParameter', 'canDelete', 'canUpdate', 'canInsert', 'currentIndex', 'isDirty', 'isDeleting', 'isLoading', 'isSaving', 'loadError', 'saveFailed'];

export default dataObjectConnect;
