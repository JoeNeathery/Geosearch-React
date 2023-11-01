import "./SearchResultsList.css";
import { SearchResult } from "./SearchResults";

export const SearchResultsList = ({ results }) => {
  console.log(results);
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.displayName} key={id} />;
      })}
    </div>
  );
};