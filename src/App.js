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

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search />

      <hr />

      <List list={stories} />
    </div>
  );
};

// define state
const Search = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // A. handler function defined here
  const handleChange = (event) => {

    // C. callback/action point ... set state on change ... re render
    setSearchTerm(event.target.value);
  };

  
  return (
    <div>
      <label htmlFor="search">Search: </label>

      // B. call back trigger ... function used here
      <input id="search" type="text" onChange={handleChange} />

      <p>
        // searchTerm is a function ... will re-render when changed
        Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  );
};

const List = (props) => (
  <ul>
    {props.list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

const Item = (props) => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
);

export default App;