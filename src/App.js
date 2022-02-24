import * as React from 'react';

// define Simi Persistant State Function
const useSemiPersistentState = (key, initialState) => {
  // state
  //      [current-state, state-change-func] ... "use State Hook"
  //       get variable from storage if it exists
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // update browser storage anytime the searchTerm changes
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};


const App = () => {
  const stories = [
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

  // state
  //      [current-state, state-change-func] ... "useSemiPersistantState uses State Hook"
  //       storage-key, initital value
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );
  

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

      <List list={searchedStories} />
    </div>
  );
};

// React Reusable Component ... defaults to text
// Refactor to imparative programming ...
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
// React Fragmants <> </>
  <>
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

const Search = ({search, onSearch}) => (
  <> {/* React Fragment ... https://www.educative.io/edpresso/what-are-react-fragments */}
    <label htmlFor="search">Search: </label>
    {/* B. uses the call back onSearch here */}
    <input id="search" type="text" value={search} onChange={onSearch} />
  </>
);

const List = ({list}) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

export default App;

