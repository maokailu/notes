import React from 'react';
import Day from './Day';
import SelectOption from './SelectOption';
import '../Adaptation';
import './style.scss';
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
let week = date.getDate();

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentyear: year,
      currentmonth: month,
      currentIndex: this.getFirstDay(month, year) + week - 1
    };
  }

  selectYear = event => {
    let value = parseInt(event.target.value);
    this.setState(prevState => ({
      currentyear: value,
      currentIndex:
        this.getFirstDay(prevState.currentmonth,  value) +
        prevState.currentIndex - this.getFirstDay(prevState.currentmonth, prevState.currentyear)
    }));
  }
  selectMonth = event => {
    let value = parseInt(event.target.value);
    this.setState(prevState => {
      return {
        currentmonth: value,
        currentIndex:
          this.getFirstDay(value,  prevState.currentyear) +
          prevState.currentIndex - this.getFirstDay(prevState.currentmonth,  prevState.currentyear)
      };
    });
  }
  componentDidMount() {
  }
  getSizeOfMonth = (year, month) => {
    let sizeOfMonths = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];
    if (year % 100 === 0 && year % 400 === 0) {
      sizeOfMonths[1]++;
    }
    let sizeOfMonth = sizeOfMonths[month];
    return sizeOfMonth;
  }
  getFirstDay = (month, year) =>{
    let timestamp = Date.parse((month + 1) + '/1/' + year);
    let date = new Date(timestamp);
    let firstDay = date.getDay();
    return firstDay;
  }
  getTable = () => {
    let sizeOfPrevMonth;
    if (this.state.currentmonth === 0) {
      sizeOfPrevMonth = this.getSizeOfMonth(this.state.currentyear - 1, 11);
    } else {
      sizeOfPrevMonth = this.getSizeOfMonth(this.state.currentyear, this.state.currentmonth - 1);
    }
    let sizeOfCurrentMonth = this.getSizeOfMonth(this.state.currentyear, this.state.currentmonth);
    let firstDay = this.getFirstDay(this.state.currentmonth, this.state.currentyear);
    let days = [];
    for (let i = sizeOfPrevMonth - firstDay + 1; i <= sizeOfPrevMonth; i++) {
      days.push(i);
    }
    for (let j = 1; j <= sizeOfCurrentMonth; j++) {
      days.push(j);
    }
    if (this.state.currentmonth !== 11 || this.state.currentyear !== year) {
      for (let k = 1; k <= 42 - sizeOfCurrentMonth - firstDay; k++) {
        days.push(k);
      }
    }
    let table = [];
    (new Array(6)).fill(0).forEach((row, rowIndex) => {
      table.push(days.slice(rowIndex * 7, (rowIndex + 1) * 7));
    });
    return table;
  }

  clickHandler = index => {
    let currentmonth = this.state.currentmonth;
    let currentyear = this.state.currentyear;
    let firstDayOfCurrentMonth = this.getFirstDay(currentmonth, currentyear);
    let firstDayOfPrevMonth = this.getFirstDay(currentmonth - 1, currentyear);
    let firstDayOfNextMonth = 0;
    if (currentmonth === 11) {
      firstDayOfNextMonth = this.getFirstDay(0, currentyear + 1);
    } else {
      firstDayOfNextMonth = this.getFirstDay(currentmonth + 1, currentyear);
    }
    let sizeOfCurrentMonth = this.getSizeOfMonth(currentyear, currentmonth);
    let sizeOfPrevMonth = this.getSizeOfMonth(currentyear, currentmonth - 1);
    this.setState({
      currentIndex: index
    });
    if (index < firstDayOfCurrentMonth) {
      this.setState(prevState => {
        return {
          currentmonth: prevState.currentmonth - 1,
          currentIndex:
            index
            + sizeOfPrevMonth
            - firstDayOfCurrentMonth
            + firstDayOfPrevMonth
        };
      });
    } else if (index >= firstDayOfCurrentMonth + sizeOfCurrentMonth) {
      this.setState(prevState => ({
        currentmonth: prevState.currentmonth === 11 ? 0 : prevState.currentmonth + 1,
        currentyear: prevState.currentmonth === 11 ? prevState.currentyear + 1 : prevState.currentyear,
        currentIndex:
          index - firstDayOfCurrentMonth
          - sizeOfCurrentMonth
          + firstDayOfNextMonth
      }));
    }
  }

  render() {
    let firstDay = this.getFirstDay(this.state.currentmonth, this.state.currentyear);
    let sizeOfCurrentMonth = this.getSizeOfMonth(this.state.currentyear, this.state.currentmonth);
    return (
      <div className="datePicker">
        <div className="fullcalender-header">
          <select value = {this.state.currentyear} onChange={this.selectYear}>
            {(new Array(5)).fill((new Date).getFullYear()).map((year, index) =>
              <SelectOption value = {year - index} text = {year - index} key = {index} />
            )};
          </select>
          <select value = {this.state.currentmonth} onChange={this.selectMonth}>
            {(new Array(12)).fill((new Date).getMonth()).map((month, index) =>
              <SelectOption value = {month - index} text = {month - index + 1} key = {index} />
            )};
          </select>
        </div>
        <table>
          <thead>
            <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>
          </thead>
          <tbody>
            {this.getTable().map((row, rowIndex) =>
              <tr key={rowIndex}>
                {
                  row.map((day, columnIndex) =>
                    <Day
                      key={rowIndex * 7 + columnIndex} index ={rowIndex * 7 + columnIndex}
                      sizeOfPrevShowDays={firstDay}
                      sizeOfCurrentMonth = {sizeOfCurrentMonth}
                      day={day}
                      clickHandler = {()=>this.clickHandler(rowIndex * 7 + columnIndex, event)}
                      currentIndex = {this.state.currentIndex}
                    />
                  )
                }
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}