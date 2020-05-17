import FilterComponent from "../components/filter";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getCardsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._movieModel.getCardsAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getCardsByFilter(allCards, filterType).length,
        active: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);


    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  getFilterComponent() {
    return this._filterComponent;
  }

  _onFilterChange(filterType) {
    this._movieModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
