(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.dataObjectHooks = {}));
}(this, function (exports) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  const { React } = window;
  const PureComponent = React.PureComponent;
  const Component = React.Component;
  const useState = React.useState;
  const useEffect = React.useEffect;

  function getData(dataObject, filter) {
    var data = window.af.data;
    var dataHandler = new data.DataProviderHandler({
      dataSourceId: dataObject.getDataSourceId(),
      timeout: 30000
    });
    var fields = dataObject.getFields();
    return new Promise(function (resolve, reject) {
      dataHandler.retrieve({
        filterString: "",
        whereClause: filter
      }, function (error, data) {
        if (error !== null) {
          reject(error);
        } else {
          var records = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;
              var record = {};

              for (var i = 0; i < item.length; i++) {
                record[fields[i].name] = item[i];
              }

              records.push(record);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          resolve(records);
        }
      });
    });
  }

  function useCurrentIndex(dataObject) {
    var _useState = useState(dataObject.getCurrentIndex()),
        _useState2 = _slicedToArray(_useState, 2),
        index = _useState2[0],
        setIndex = _useState2[1];

    useEffect(function () {
      dataObject.attachEvent("onCurrentIndexChanged", setIndex);
      setIndex(dataObject.getCurrentIndex());
      return function () {
        return dataObject.detachEvent("onCurrentIndexChanged", setIndex);
      };
    }, [dataObject]);
    return index;
  }
  var dataUpdateEvents = ["onFieldChanged", "onRecordCreated", "onRecordDeleted", "onRecordRefreshed", "onAfterSave", "onCancelEdit", "onDataLoaded"];
  function useCurrentRow(dataObject) {
    var _useState3 = useState({}),
        _useState4 = _slicedToArray(_useState3, 2),
        record = _useState4[0],
        setRecord = _useState4[1];

    function updateRecord() {
      setRecord(dataObject.currentRow());
    }

    useEffect(function () {
      var recordUpdateEvents = ["onCurrentIndexChanged"].concat(dataUpdateEvents);
      recordUpdateEvents.forEach(function (event) {
        return dataObject.attachEvent(event, updateRecord);
      });
      updateRecord();
      return function () {
        return recordUpdateEvents.forEach(function (event) {
          return dataObject.detachEvent(event, updateRecord);
        });
      };
    }, [dataObject]);
    return record;
  }
  function useSingleRecord(dataObject, filter) {
    var _useState5 = useState(null),
        _useState6 = _slicedToArray(_useState5, 2),
        record = _useState6[0],
        setRecord = _useState6[1];

    var _useState7 = useState(true),
        _useState8 = _slicedToArray(_useState7, 2),
        isLoading = _useState8[0],
        setIsLoading = _useState8[1];

    function refresh() {
      setIsLoading(true);
      getData(dataObject, filter).then(function (data) {
        if (data.length > 0) {
          setRecord(data[0]);
        } else {
          setRecord(null);
        }

        setIsLoading(false);
      });
    }

    useEffect(function () {
      refresh();
    }, [dataObject, filter]);
    return {
      record: record,
      refresh: refresh,
      isLoading: isLoading
    };
  }
  function useData(dataObject) {
    var _useState9 = useState([]),
        _useState10 = _slicedToArray(_useState9, 2),
        data = _useState10[0],
        setData = _useState10[1];

    function updateData() {
      setData(dataObject.getData());
    }

    useEffect(function () {
      dataUpdateEvents.forEach(function (event) {
        return dataObject.attachEvent(event, updateData);
      });
      updateData();
      return function () {
        return dataUpdateEvents.forEach(function (event) {
          return dataObject.detachEvent(event, updateData);
        });
      };
    }, [dataObject]);
    return data;
  }
  function useDataWithoutState(dataObject, filter) {
    var _useState11 = useState(null),
        _useState12 = _slicedToArray(_useState11, 2),
        data = _useState12[0],
        setData = _useState12[1];

    var _useState13 = useState(true),
        _useState14 = _slicedToArray(_useState13, 2),
        isLoading = _useState14[0],
        setIsLoading = _useState14[1];

    function refresh() {
      setIsLoading(true);
      getData(dataObject, filter).then(function (data) {
        if (data.length > 0) {
          setData(data);
        } else {
          setData([]);
        }

        setIsLoading(false);
      });
    }

    useEffect(function () {
      refresh();
    }, [dataObject, filter]);
    return {
      data: data,
      refresh: refresh,
      isLoading: isLoading
    };
  }
  function useDirty(dataObject) {
    var _useState15 = useState(false),
        _useState16 = _slicedToArray(_useState15, 2),
        isDirty = _useState16[0],
        setDirty = _useState16[1];

    useEffect(function () {
      dataObject.attachEvent("onDirtyChanged", setDirty);
      setDirty(dataObject.isDirty());
      return function () {
        dataObject.detachEvent("onDirtyChanged", setDirty);
      };
    }, [dataObject]);
    return isDirty;
  }
  function useError(dataObject) {
    var _useState17 = useState(null),
        _useState18 = _slicedToArray(_useState17, 2),
        loadError = _useState18[0],
        setError = _useState18[1];

    useEffect(function () {
      dataObject.attachEvent("onDataLoadFailed", setError);
      return function () {
        dataObject.detachEvent("onDataLoadFailed", setError);
      };
    }, [dataObject]);
    return loadError;
  }
  function useLoading(dataObject) {
    var _useState19 = useState(dataObject.isDataLoading()),
        _useState20 = _slicedToArray(_useState19, 2),
        isLoading = _useState20[0],
        setLoading = _useState20[1];

    function setIsLoading() {
      setLoading(true);
    }

    function setIsNotLoading() {
      setLoading(false);
    }

    useEffect(function () {
      dataObject.attachEvent("onBeforeLoad", setIsLoading);
      dataObject.attachEvent("onDataLoaded", setIsNotLoading);
      dataObject.attachEvent("onDataLoadFailed", setIsNotLoading);
      setLoading(dataObject.isDataLoading);
      return function () {
        dataObject.detachEvent("onBeforeLoad", setIsLoading);
        dataObject.detachEvent("onDataLoaded", setIsNotLoading);
        dataObject.detachEvent("onDataLoadFailed", setIsNotLoading);
      };
    }, [dataObject]);
    return isLoading;
  }
  function useStatus(dataObject) {
    var _useState21 = useState(false),
        _useState22 = _slicedToArray(_useState21, 2),
        isSaving = _useState22[0],
        setIsSaving = _useState22[1];

    var _useState23 = useState(false),
        _useState24 = _slicedToArray(_useState23, 2),
        isDeleting = _useState24[0],
        setIsDeleting = _useState24[1];

    function setSaving() {
      setIsSaving(true);
    }

    function setNotSaving() {
      setIsSaving(false);
    }

    function setDeleting() {
      setIsDeleting(true);
    }

    function setNotDeleting() {
      setIsDeleting(false);
    }

    useEffect(function () {
      dataObject.attachEvent("onBeforeSave", setSaving);
      dataObject.attachEvent("onAfterSave", setNotSaving);
      dataObject.attachEvent("onSaveFailed", setNotSaving);
      dataObject.attachEvent("onRecordDeleting", setDeleting);
      dataObject.attachEvent("onRecordDeleted", setNotDeleting);
      return function () {
        dataObject.detachEvent("onBeforeSave", setSaving);
        dataObject.detachEvent("onAfterSave", setNotSaving);
        dataObject.detachEvent("onSaveFailed", setNotSaving);
        dataObject.detachEvent("onRecordDeleting", setDeleting);
        dataObject.detachEvent("onRecordDeleted", setNotDeleting);
      };
    }, [dataObject]);
    return {
      isDeleting: isDeleting,
      isSaving: isSaving
    };
  }
  function usePermissions(dataObject) {
    var _useState25 = useState(dataObject.isDeleteAllowed()),
        _useState26 = _slicedToArray(_useState25, 2),
        allowDelete = _useState26[0],
        setAllowDelete = _useState26[1];

    var _useState27 = useState(dataObject.isInsertAllowed()),
        _useState28 = _slicedToArray(_useState27, 2),
        allowInsert = _useState28[0],
        setAllowInsert = _useState28[1];

    var _useState29 = useState(dataObject.isUpdateAllowed()),
        _useState30 = _slicedToArray(_useState29, 2),
        allowUpdate = _useState30[0],
        setAllowUpdate = _useState30[1];

    useEffect(function () {
      dataObject.attachEvent("onAllowDeleteChanged", setAllowDelete);
      dataObject.attachEvent("onAllowInsertChanged", setAllowInsert);
      dataObject.attachEvent("onAllowUpdateChanged", setAllowUpdate);
      return function () {
        dataObject.detachEvent("onAllowDeleteChanged", setAllowDelete);
        dataObject.detachEvent("onAllowInsertChanged", setAllowInsert);
        dataObject.detachEvent("onAllowUpdateChanged", setAllowUpdate);
      };
    }, [dataObject]);
    return {
      allowDelete: allowDelete,
      allowInsert: allowInsert,
      allowUpdate: allowUpdate
    };
  }

  exports.useCurrentIndex = useCurrentIndex;
  exports.useCurrentRow = useCurrentRow;
  exports.useSingleRecord = useSingleRecord;
  exports.useData = useData;
  exports.useDataWithoutState = useDataWithoutState;
  exports.useDirty = useDirty;
  exports.useError = useError;
  exports.useLoading = useLoading;
  exports.useStatus = useStatus;
  exports.usePermissions = usePermissions;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
