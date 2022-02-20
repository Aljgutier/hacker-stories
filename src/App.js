import * as React from 'react';

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
  //      [current-state, state-change-func] ... "use State Hook"
  //       get variable from storage if it exists
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem('search') || 'React'
  );

  // update browser storage anytime the searchTerm changes
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm); },
     [searchTerm]);

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

      {/* B. Pass call back function down
             ... notice change of variable name search = searchTerm  */}
      <Search search = {searchTerm} onSearch={handleSearch} />

      <hr />

      <List list={searchedStories} />
    </div>
  );
};

const Search = ({search, onSearch}) => (
  <div>
    <label htmlFor="search">Search: </label>
    {/* B. uses the call back onSearch here */}
    <input id="search" type="text" value={search} onChange={onSearch} />
  </div>
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

