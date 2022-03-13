import * as React from 'react';

// hacker stories endbopoint
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';


// define Semi Persistant State Function ... used for search term
// persistance is for the search term
// uses the state management separate from stories state management
// useState hook 
// state ... 
//     useState state hook for updating the state
//     useEffect carries an effect when state changes
//      [state-variable, state-change-func] ... use State Hook
//         when called by the component,
//         component updated when the value of state variable changes
//       get variable from storage if it exists
//       setValue is the function for changing the value
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );


  // React's useEffect Hook
  // updates browser storage anytime the searchTerm changes

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

// Manage all state variables for stories here
// function to be used by reducer ... the reducer function receives state and action
// action is always associated with a type
// returns payload which becomes the new state
// use switch statement instead of if else
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {

  // state  ... use custom function for state mananagement defined above
  //      [current-state, state-change-func] ... "useSemiPersistantState uses State Hook"
  //       storage-key, initital value
  //       key = 'search'
  //       initial_value = 'React'
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );


  // reducer hook ... manages all stories state variables
  //   Input: reducer-function and initial state
  //   Output: array with two items - state , and updater function
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  // Replace Effect hook with useCallBack hook
  // [] second argument, empty array ... effect only runs at first time render ...
  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [searchTerm]);

  // invoce handleFetchStories (useCallBack) with useEffect ... second argutment is an array of dependancies
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // Handle Remove Item
  // Reducer Update Function
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };


  // A. call back handler function
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}; // end const App function


// React Reusable Component ... defaults to text
// Refactor to imparative programming ...
// generally better to stacy declaritive, but sometimes imperattive i
//     A create ref, 
//     B pass to input, 
//     C opt into React's lifecye
//     D get access to the current state and execute its focus
const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  // A create a ref with React's useRef hook, includes current property
  const inputRef = React.useRef();


  // C opt into React's lifecycle with React's useEffect Hook
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
