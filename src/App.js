import * as React from 'react';



const initialStories = [
  {   
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

  // define Semi Persistant State Function
const useSemiPersistentState = (key, initialState) => {
  // state ... 
  //     useState state hook for updating the state
  //     useEffect carries an effect when state changes
  //      [state-variable, state-change-func] ... use State Hook
  //         when called by the component,
  //         component updated when the value of state variable changes
  //       get variable from storage if it exists
  //       setValue is the function for changing the value
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

// function to be used by reducer ... the reducer function receives state and action
// action is always associated with a type
// returns payload which becomes the new state
// use switch statement instead of if else
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      );
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

  // reducer hook 
  //   Input: reducer-function and initial state
  //   Output: array with two items - state , and updater function
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    []
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  

  // Effect hook
  // [] second argument, empty array ... effect only runs at first time render ...
  React.useEffect(() => {
    setIsLoading(true);

    // Reducer load stories
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);


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
    //C. call back action ... on change set the search state variable ... seearchTerm
    setSearchTerm(event.target.value);
  };
  
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* B. Pass call back function down */}
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused // defaults to true 
        onInputChange={handleSearch}>
        <strong>Search</strong>
        </InputWithLabel>
      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
            //{/* add callback function for handleRemoveStory ... pass down */}
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
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
  label,
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
      //D current property gives access to the element
      inputRef.current.focus();
  } 
},[isFocused]);


return(
  <>  {/* React Fragment ... don't create a DOM */}
    <label htmlFor={id}>{label}</label>
    &nbsp;
      {/* B ref is passed into input JSX reserved ref attribute*/}
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      autofocus={isFocused}
      onChange={onInputChange}
    />
  </>
 );
};


// receives handler function for onRemoveItem
const List = ({list, onRemoveItem}) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} 
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
      {/* inline method */}
      {/* Dismiss <- remove item */}
      <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
      {/*regular method*/}
      {/* <button type ="button" onClick={handleRemoveItem}>Dismiss</button> */}
    </span>
  </li>
);

export default App;

