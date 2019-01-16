# React Data Object Connect

### HoC that connects AppframeWeb data objects to React components.

## Getting Started

### Installation

Install using npm

```
npm install --save @olenbetong/react-data-object-connect
```

or include the umd build in a script

```html
<script src="https://unpkg.com/@olenbetong/react-data-object-connect@latest/dist/data-object-connect.umd.min.js"></script>
```

### Usage

The dataObjectConnect function takes 2 parameters. The first is the data object to connect. The second is a boolean indicating whether you only want the current row. Default is false. This will return the HoC function to connect to React components.

If connected only to the current row, each field in the row is passed as a property to the wrapped component. Otherwise, the data is passed as an array of records to the `data` property. The current state of the data object, and functions to modify the data will also be passed.

Example connecting to all records:

```jsx
import React from 'react';
import dataObjectConnect from '@olenbetong/react-data-object-connect';

const MyListComponent = (props) => <ul>
	{props.data.map(item => <li key={item.PrimKey}>{item.Title}</li>)}
</ul>

const MyConnectedList = dataObjectConnect(dsMyDataObject)(MyListComponent);
```

Example connecting to a single record, and checking if it is modified:

```jsx
import React from 'react';
import dataObjectConnect from '@olenbetong/react-data-object-connect';

const MyRecordComponent = (props) => <p>
	{props.isDirty && <div>(Data not saved</div>)}
	{props.Title}
</p>

const MyConnectedComponent = dataObjectConnect(dsMyDataObject, true)(MyRecordComponent);
```

#### Properties

Status properties passed to the component:
 * **canDelete** (bool) whether the data object allows deleting rows
 * **canUpdate** (bool) whether the data object allows updating rows
 * **canInsert** (bool) whether the data object allows inserting rows
 * **currentIndex** (int) current index selected
 * **isDirty** (bool) whether the currently selectec row has been modified
 * **isDeleting** (bool) whether the data object is currently deleting a row
 * **isLoading** (bool) whether the data object is currently loading data
 * **isSaving** (bool) whether the data object is currently saving a record
 * **loadError** (string) error message if the data failed to load

Function properties passed to the component:
 * **onCancelEdit** used to cancel all changes made to the current record
 * **onCurrentIndexChange** used to select a row by index
 * **onEndEdit** used to attempt to save changes made to the current record
 * **onDeleteRow** used to delete a row. A component connected to the current row will always delete the current row, otherwise an index can be passed
 * **onFieldChange** used to update a field in the current row (name of field and value as parameters)
 * **onFieldsChange** used to update multiple fields in the current row (object with field names as keys, and values as values)
 * **onRefreshData** used to refresh data
 * **onRefreshRow** used to refresh only the current row
 * **onSetParameter** used to set a parameter on the data object

 ## Hooks

 If using a React version with hooks, there are also data object hooks available:

 * useCurrentIndex - returns only the current index
 * useCurrentRow - returns the current record
 * useData - returns an array with all records
 * useDirty - returns a boolean indicating if the current row is dirty or not
 * useError - returns any loading error message
 * useLoading - returns a boolean indicating if the data object is loading or not
 * useStatus - returns booleans indicating if the data object is saving or deleting records
 * usePermissions - returns booleans indicating if the user can delete, insert or update records

 ### Usage

 **NB!** You have to include a separate script as the hooks are not bundles with the dataObjectConnect function.

 ```html
 <script src="/file/component/modules/umd/data-object-hooks.min.js" type="text/javascript"></script>
 ```

```jsx
const {
	useCurrentIndex,
	useCurrentRow,
	useData,
	useDirty,
	useError,
	useLoading,
	useStatus,
	usePermissions,
} = dataObjectHooks;

function MyFunctionComponent(props) {
	const currentIndex = useCurrentIndex(dsMyDataObject);
	const myRecord = useCurrentRow(dsMyDataObject);
	const myRecords = useData(dsMyDataObject);
	const isDirty = useDirty(dsMyDataObject);
	const error = useError(dsMyDataObject);
	const isLoading = useLoading(dsMyDataObject);
	const { isDeleting, isSaving } = useStatus(dsMyDataObject);
	const { allowDelete, allowInsert, allowUpdate } = usePermissions(dsMyDataObject);

	return <div>
		{isLoading && <i className='fa fa-spin fa-spinner'/>}
		{error && <Error message={error} />}
		<MyEditor {...myRecord} isDirty={isDirty}/>
		{myRecords.map(record => <ListItem {...item} />)}
	</div>
}
``` 