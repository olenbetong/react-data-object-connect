const { useEffect, useState } = window.React;

export function useCurrentIndex(dataObject) {
	const [index, setIndex] = useState(dataObject.getcurrentIndex());

	useEffect(() => {
		dataObject.attachEvent('onCurrentIndexChanged', setIndex);

		return () => dataObject.detachEvent('onCurrentIndexChanged', setIndex);
	}, [dataObject]);

	return index;
}

const dataUpdateEvents = [
	'onCurrentIndexChanged',
	'onFieldChanged',
	'onRecordCreated',
	'onRecordRefreshed',
	'onAfterSave',
	'onCancelEdit',
	'onDataLoaded',
];

export function useCurrentRow(dataObject) {
	const [record, setRecord] = useState(dataObject.currentRow());
	
	useEffect(() => {
		function updateRecord() {
			setRecord(dataObject.currentRow());
		}
		
		dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateRecord));
		
		return () => dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateRecord));
	}, [dataObject]);
	
	return record;
}

export function useData(dataObject) {
	const [data, setRecord] = useState(dataObject.getData());
	
	useEffect(() => {
		function updateData() {
			setRecord(dataObject.getData());
		}
		
		dataUpdateEvents.forEach(event => dataObject.attachEvent(event, updateData));
		
		return () => dataUpdateEvents.forEach(event => dataObject.detachEvent(event, updateData));
	}, [dataObject]);
	
	return data;
}

export function useDirty(dataObject) {
	const [isDirty, setDirty] = useState(dataObject.isDirty());

	useEffect(() => {
		dataObject.attachEvent('onDirtyChanged', setDirty);

		return () => {
			dataObject.detachEvent('onDirtyChanged', setDirty);
		};
	}, [dataObject]);

	return isDirty;
}

export function useErrors(dataObject) {
	const [loadError, setError] = useState(null);

	useEffect(() => {
		dataObject.attachEvent('onDataLoadFailed', setError);

		return () => {
			dataObject.detachEvent('onDataLoadFailed', setError);
		};
	}, [dataObject]);

	return loadError;
}

export function useLoading(dataObject) {
	const [isLoading, setLoading] = useState(dataObject.isDataLoading());

	useEffect(() => {
		dataObject.attachEvent('onDirtyChanged', setLoading);

		return () => {
			dataObject.detachEvent('onDirtyChanged', setLoading);
		};
	}, [dataObject]);

	return isLoading;
}

export function useStatus(dataObject) {
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		function setSaving() { setIsSaving(true); }
		function setNotSaving() { setIsSaving(false); }
		function setDeleting() { setIsDeleting(true); }
		function setNotDeleting() { setIsDeleting(false); }

		dataObject.attachEvent('onBeforeSave', setSaving);
		dataObject.attachEvent('onAfterSave', setNotSaving);
		dataObject.attachEvent('onSaveFailed', setNotSaving);

		dataObject.attachEvent('onRecordDeleting', setDeleting);
		dataObject.attachEvent('onRecordDeleted', setNotDeleting);

		return () => {
			dataObject.detachEvent('onBeforeSave', setSaving);
			dataObject.detachEvent('onAfterSave', setNotSaving);
			dataObject.detachEvent('onSaveFailed', setNotSaving);

			dataObject.detachEvent('onRecordDeleting', setDeleting);
			dataObject.detachEvent('onRecordDeleted', setNotDeleting);
		};
	}, [dataObject]);

	return {
		isDeleting,
		isSaving,
	};
}

export function usePermissions(dataObject) {
	const [allowDelete, setAllowDelete] = useState(dataObject.isDeleteAllowed());
	const [allowInsert, setAllowInsert] = useState(dataObject.isInsertAllowed());
	const [allowUpdate, setAllowUpdate] = useState(dataObject.isUpdateAllowed());

	useEffect(() => {
		dataObject.attachEvent('onAllowDeleteChanged', setAllowDelete);
		dataObject.attachEvent('onAllowInsertChanged', setAllowInsert);
		dataObject.attachEvent('onAllowUpdateChanged', setAllowUpdate);

		return () => {
			dataObject.detachEvent('onAllowDeleteChanged', setAllowDelete);
			dataObject.detachEvent('onAllowInsertChanged', setAllowInsert);
			dataObject.detachEvent('onAllowUpdateChanged', setAllowUpdate);
		};
	}, [dataObject]);

	return {
		allowDelete,
		allowInsert,
		allowUpdate
	};
}