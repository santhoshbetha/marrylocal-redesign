import { useState, createContext } from 'react';
export const SearchDataAndRecoveryContext = createContext();

//https://devtrium.com/posts/how-use-react-context-pro

export function SearchDataAndRecoveryContextProvider(props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState();
  const [imagesList, setImagesList] = useState(null);
  const [logininitsDone, setLogininitsDone] = useState(false);

  return (
    <SearchDataAndRecoveryContext.Provider
      value={{
        code,
        setCode,
        email,
        setEmail,
        imagesList,
        setImagesList,
        logininitsDone,
        setLogininitsDone,
      }}
    >
      {props.children}
    </SearchDataAndRecoveryContext.Provider>
  );
}
