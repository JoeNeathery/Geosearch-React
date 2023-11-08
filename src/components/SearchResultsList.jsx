import "./SearchResultsList.css";
import { SearchResult } from "./SearchResults";

export const SearchResultsList = ({ facilities, locations }) => {
  return (
    <div className="results-list">
      <div>
      {facilities.length > 0 && <h3 className="list-section-header">Facilities</h3>}
      {facilities.map((facility, id) => {
        return <SearchResult result={facility.displayName} resultId={facility.mongoId} type={"Facility"} key={id} />;
      })}
      </div>
      <div>
      {locations.length > 0 && <h3 className="list-section-header">Locations</h3>}
      {locations.map((location, id) => {
        return <SearchResult result={location.displayName} resultId={location.mongoId} type={"Location"} key={id} />;
      })}
      </div>
    </div>
  );
};